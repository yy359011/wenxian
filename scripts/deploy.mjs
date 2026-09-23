/**
 * 构建产物发布到 GitHub Pages
 *
 * 流程：构建 -> 在临时目录克隆远端 gh-pages 分支 -> 用 dist 覆盖内容 -> 提交 -> 推送
 * 使用克隆而非孤儿分支，保证推送是快进（不需要 --force）。
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const BRANCH = 'gh-pages'
const DEFAULT_REPO = 'https://github.com/yy359011/wenxian.git'
const COMMITTER = { name: 'yy359011', email: 'yy359011@users.noreply.github.com' }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const workDir = join(tmpdir(), 'wenxian-gh-pages')

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: 'utf8'
  })
}

/** npm 在 Windows 上是 npm.cmd，必须通过 shell 执行 */
function runNpm(args) {
  const isWindows = process.platform === 'win32'
  const result = isWindows
    ? spawnSync(['npm', ...args].join(' '), { cwd: root, encoding: 'utf8', shell: true })
    : spawnSync('npm', args, { cwd: root, encoding: 'utf8' })
  return result
}

function git(args, cwd, { allowFail = false } = {}) {
  const result = run('git', args, { cwd })
  if (result.status !== 0 && !allowFail) {
    const detail = (result.stderr || result.stdout || '').trim()
    throw new Error(`git ${args.join(' ')} 执行失败\n${detail}`)
  }
  return result
}

function resolveRepo() {
  const remote = git(['remote', 'get-url', 'origin'], root, { allowFail: true })
  const url = remote.status === 0 ? remote.stdout.trim() : ''
  return url || DEFAULT_REPO
}

function build() {
  console.log('> npm run build')
  const result = runNpm(['run', 'build'])
  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? '')
    process.stderr.write(result.stderr ?? '')
    throw new Error('构建失败，已终止发布')
  }
  console.log(result.stdout?.trim() ?? '')

  for (const file of ['index.html', '404.html']) {
    if (!existsSync(join(distDir, file))) {
      throw new Error(`缺少构建产物 dist/${file}，请检查 vite.config.ts 配置`)
    }
  }
}

function prepareWorkDir(repo) {
  rmSync(workDir, { recursive: true, force: true })
  mkdirSync(workDir, { recursive: true })

  // 远端已有 gh-pages 分支时可快进推送；首次发布则新建孤儿分支
  const cloned = git(['clone', '--branch', BRANCH, '--depth', '1', repo, workDir], root, { allowFail: true })
  if (cloned.status === 0) {
    console.log(`> 已拉取远端 ${BRANCH} 分支`)
  } else {
    console.log(`> 远端暂无 ${BRANCH} 分支，将新建`)
    git(['init', '-b', BRANCH], workDir)
    git(['remote', 'add', 'origin', repo], workDir)
  }

  // 清空工作区（保留 .git），避免残留旧产物
  for (const entry of readdirSync(workDir)) {
    if (entry !== '.git') rmSync(join(workDir, entry), { recursive: true, force: true })
  }
}

function publish() {
  cpSync(distDir, workDir, { recursive: true })
  // 关闭 Jekyll，避免下划线开头的资源被忽略
  writeFileSync(join(workDir, '.nojekyll'), '')

  git(['add', '-A'], workDir)

  const staged = git(['status', '--porcelain'], workDir).stdout.trim()
  if (!staged) {
    console.log('> 产物无变化，跳过提交')
    return false
  }

  const message = `chore(deploy): 发布 ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
  git(
    ['-c', `user.name=${COMMITTER.name}`, '-c', `user.email=${COMMITTER.email}`, 'commit', '-m', message],
    workDir
  )

  console.log(`> git push origin ${BRANCH}`)
  const pushed = git(['push', 'origin', BRANCH], workDir, { allowFail: true })
  if (pushed.status !== 0) {
    process.stdout.write(pushed.stdout ?? '')
    process.stderr.write(pushed.stderr ?? '')
    throw new Error('推送失败，请确认本地已登录 GitHub 且拥有该仓库写权限')
  }
  return true
}

function main() {
  const probe = run('git', ['--version'])
  if (probe.status !== 0) throw new Error('未检测到 git，请先安装并配置到 PATH')

  const repo = resolveRepo()
  console.log(`> 目标仓库 ${repo} (${BRANCH})`)

  build()
  prepareWorkDir(repo)
  const published = publish()

  console.log(published ? '\n发布完成，等待 1-2 分钟后访问 Pages 地址。' : '\n产物未发生变化，无需发布。')
}

main()
