<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Close,
  Folder,
  Headset,
  Mute,
  Refresh,
  RefreshLeft,
  VideoPause,
  VideoPlay,
  ZoomIn,
  ZoomOut
} from '@element-plus/icons-vue'
import BookLeaf from '@/components/common/BookLeaf.vue'
import { buildBook } from '@/utils/book'
import type { BookLeafPage, DocumentItem } from '@/types'

const props = defineProps<{
  modelValue: boolean
  item: DocumentItem | null
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const book = computed(() => (props.item ? buildBook(props.item) : null))
const pages = computed<BookLeafPage[]>(() => book.value?.pages ?? [])
const total = computed(() => pages.value.length)

/** 每张书帖含正反两面，共可翻转 sheets.length 次 */
const sheets = computed<BookLeafPage[][]>(() => {
  const result: BookLeafPage[][] = []
  for (let i = 0; i < pages.value.length; i += 2) result.push(pages.value.slice(i, i + 2))
  return result
})

/** 已翻过的书帖数量：0 表示停在封面，sheets.length 表示全部翻完 */
const current = ref(0)
const flipping = ref<number | null>(null)
const silent = ref(false)
const scale = ref(1)
const soundOn = ref(true)
const autoPlay = ref(false)
const catalogOpen = ref(false)
const jumpText = ref('1')

/** 最近一次定位到的页码（目录跳页时记录） */
const focusPageNo = ref(1)

const bookRef = ref<HTMLElement | null>(null)

let flipTimer = 0
let autoTimer = 0

/** 当前跨页实际展示的页码：current 为 0 时仅有封面 */
const spreadPages = computed<number[]>(() => {
  if (current.value === 0) return [1]
  const left = current.value * 2
  const right = left + 1
  return right <= total.value ? [left, right] : [left]
})

/** 页码指示：优先显示最近定位的页面，否则显示跨页左页 */
const activePageNo = computed(() => {
  const list = spreadPages.value
  return list.includes(focusPageNo.value) ? focusPageNo.value : list[0]
})

const canPrev = computed(() => current.value > 0)
const canNext = computed(() => current.value < sheets.value.length)

function sheetZ(index: number): number {
  if (index === flipping.value) return 400
  return index < current.value ? index + 1 : 100 - index
}

/* ---------------- 翻页 ---------------- */

function holdFlip(index: number) {
  window.clearTimeout(flipTimer)
  flipping.value = index
  flipTimer = window.setTimeout(() => {
    flipping.value = null
  }, 840)
}

function goNext() {
  if (!canNext.value) return
  const index = current.value
  focusPageNo.value = 0
  current.value = index + 1
  holdFlip(index)
  playFlip()
}

function goPrev() {
  if (!canPrev.value) return
  focusPageNo.value = 0
  current.value -= 1
  holdFlip(current.value)
  playFlip()
}

/** 目标页码对应的书帖落位：current 的值 */
function sheetOf(pageNo: number): number {
  const index = pageNo - 1
  return Math.floor(index / 2) + (index % 2)
}

/** 跳页：瞬时落位，不做翻转动画 */
async function jumpTo(pageNo: number): Promise<boolean> {
  const target = Math.floor(pageNo)
  const index = pages.value.findIndex((page) => page.pageNo === target)
  if (index < 0) return false
  catalogOpen.value = false
  focusPageNo.value = target
  const next = sheetOf(target)
  if (next === current.value) return true
  silent.value = true
  flipping.value = null
  await nextTick()
  // 强制样式计算，确保 is-static 已生效，避免跳页时播放翻转动画
  if (bookRef.value) void bookRef.value.offsetHeight
  current.value = next
  await nextTick()
  silent.value = false
  playFlip()
  return true
}

/* ---------------- 缩放 ---------------- */

function zoom(delta: number) {
  scale.value = Math.min(1.5, Math.max(0.7, Number((scale.value + delta).toFixed(2))))
}

/* ---------------- 自动播放 ---------------- */

function stopAuto() {
  window.clearInterval(autoTimer)
  autoTimer = 0
  autoPlay.value = false
}

function toggleAuto() {
  if (autoPlay.value) {
    stopAuto()
    return
  }
  autoPlay.value = true
  window.clearInterval(autoTimer)
  autoTimer = window.setInterval(() => {
    if (!canNext.value) {
      stopAuto()
      return
    }
    goNext()
  }, 4000)
}

/* ---------------- 翻书音效（Web Audio 合成） ---------------- */

let audioCtx: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx
  const host = window as unknown as {
    AudioContext?: typeof AudioContext
    webkitAudioContext?: typeof AudioContext
  }
  const Ctor = host.AudioContext ?? host.webkitAudioContext
  if (!Ctor) return null
  audioCtx = new Ctor()
  return audioCtx
}

function createNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 0.4)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return buffer
}

/** 在用户手势中预热音频上下文，避免首次翻页无声 */
function warmUpAudio() {
  if (!soundOn.value) return
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()
  if (!noiseBuffer) noiseBuffer = createNoise(ctx)
}

function toggleSound() {
  soundOn.value = !soundOn.value
  if (soundOn.value) warmUpAudio()
}

/** 合成一次翻书声：噪声带通扫频 + 指数包络 */
async function playFlip() {
  if (!soundOn.value) return
  const ctx = getAudioContext()
  if (!ctx) return
  // 上下文可能被浏览器挂起，必须等恢复完成后再取时间轴
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      return
    }
  }
  if (ctx.state !== 'running') return
  if (!noiseBuffer) noiseBuffer = createNoise(ctx)

  const now = ctx.currentTime + 0.02
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.playbackRate.value = 0.9 + Math.random() * 0.35

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.9
  filter.frequency.setValueAtTime(760, now)
  filter.frequency.exponentialRampToValueAtTime(3400, now + 0.16)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(now)
  source.stop(now + 0.36)
}

/* ---------------- 目录 ---------------- */

function isChapterActive(index: number): boolean {
  const list = book.value?.catalog ?? []
  const chapter = list[index]
  if (!chapter) return false
  const next = list[index + 1]
  return activePageNo.value >= chapter.page && (!next || activePageNo.value < next.page)
}

/** 节条目落在当前跨页内即视为选中 */
function isSectionActive(page: number): boolean {
  return spreadPages.value.includes(page)
}

/* ---------------- 页码输入 ---------------- */

function onJumpInput(event: Event) {
  const target = event.target as HTMLInputElement
  jumpText.value = target.value
}

function submitJump() {
  const value = Math.floor(Number(jumpText.value))
  if (!Number.isFinite(value) || value < 1 || value > total.value) {
    jumpText.value = String(activePageNo.value)
    return
  }
  void jumpTo(value)
  jumpText.value = String(value)
}

/* ---------------- 操作 ---------------- */

/** 重置回封面 */
function resetCover() {
  stopAuto()
  void jumpTo(1)
}

/* ---------------- 生命周期 ---------------- */

watch(activePageNo, (value) => {
  jumpText.value = String(value)
})

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      current.value = 0
      flipping.value = null
      scale.value = 1
      catalogOpen.value = false
      focusPageNo.value = 1
      jumpText.value = '1'
      warmUpAudio()
      return
    }
    stopAuto()
  }
)

function onKeydown(event: KeyboardEvent) {
  if (!visible.value) return
  const target = event.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
  if (event.key === 'Escape') {
    visible.value = false
    return
  }
  if (event.key === 'ArrowLeft') {
    goPrev()
    return
  }
  if (event.key === 'ArrowRight') goNext()
}

onMounted(() => window.addEventListener('keydown', onKeydown))

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(flipTimer)
  stopAuto()
  document.body.style.overflow = ''
  if (audioCtx) void audioCtx.close()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="reader-fade">
      <div v-if="visible && book" class="reader-mask" @click.self="visible = false">
        <section class="reader" role="dialog" aria-modal="true" :aria-label="book.title">
          <header class="reader-bar">
            <div class="reader-bar__group">
              <button
                type="button"
                class="reader-btn"
                :class="{ 'is-on': catalogOpen }"
                title="书籍目录"
                @click="catalogOpen = !catalogOpen"
              >
                <el-icon><Folder /></el-icon>
                <span>目录</span>
              </button>
              <button
                type="button"
                class="reader-btn"
                :class="{ 'is-on': soundOn }"
                :title="soundOn ? '关闭翻书音效' : '开启翻书音效'"
                @click="toggleSound"
              >
                <el-icon>
                  <Headset v-if="soundOn" />
                  <Mute v-else />
                </el-icon>
              </button>
            </div>

            <div class="reader-bar__group">
              <button type="button" class="reader-btn" title="上一页" :disabled="!canPrev" @click="goPrev">
                <el-icon><ArrowLeft /></el-icon>
              </button>
              <div class="reader-jump">
                <input
                  class="reader-jump__input"
                  type="text"
                  inputmode="numeric"
                  aria-label="页码"
                  :value="jumpText"
                  @input="onJumpInput"
                  @keyup.enter="submitJump"
                  @blur="submitJump"
                />
                <span>/ {{ total }}</span>
              </div>
              <button type="button" class="reader-btn" title="下一页" :disabled="!canNext" @click="goNext">
                <el-icon><ArrowRight /></el-icon>
              </button>
              <button
                type="button"
                class="reader-btn"
                :class="{ 'is-on': autoPlay }"
                :title="autoPlay ? '暂停自动播放' : '自动播放'"
                @click="toggleAuto"
              >
                <el-icon>
                  <VideoPause v-if="autoPlay" />
                  <VideoPlay v-else />
                </el-icon>
              </button>
            </div>

            <div class="reader-bar__group">
              <button type="button" class="reader-btn" title="缩小" @click="zoom(-0.1)">
                <el-icon><ZoomOut /></el-icon>
              </button>
              <span class="reader-zoom">{{ Math.round(scale * 100) }}%</span>
              <button type="button" class="reader-btn" title="放大" @click="zoom(0.1)">
                <el-icon><ZoomIn /></el-icon>
              </button>
              <button type="button" class="reader-btn" title="恢复原始比例" @click="scale = 1">
                <el-icon><Refresh /></el-icon>
              </button>
              <button type="button" class="reader-btn" title="关闭" @click="visible = false">
                <el-icon><Close /></el-icon>
              </button>
            </div>
          </header>

          <div class="reader-stage">
            <div
              class="reader-book"
              ref="bookRef"
              :class="{ 'is-static': silent }"
              :style="{ transform: `scale(${scale})` }"
            >
              <div
                v-for="(sheet, index) in sheets"
                :key="index"
                class="reader-sheet"
                :class="{ 'is-flipped': index < current }"
                :style="{ zIndex: sheetZ(index) }"
              >
                <div class="reader-face">
                  <BookLeaf v-if="sheet[0]" :page="sheet[0]" :book="book" @jump="jumpTo" />
                </div>
                <div class="reader-face reader-face--back">
                  <BookLeaf v-if="sheet[1]" :page="sheet[1]" :book="book" @jump="jumpTo" />
                </div>
              </div>
            </div>

            <aside class="reader-catalog" :class="{ 'is-open': catalogOpen }">
              <div class="reader-catalog__head">
                <h3>{{ book.title }}</h3>
                <p>{{ book.catalog.length }} 卷 · 共 {{ total }} 页</p>
              </div>
              <ul class="reader-catalog__list">
                <li v-for="(chapter, index) in book.catalog" :key="chapter.title">
                  <button
                    type="button"
                    class="cat-row is-chapter"
                    :class="{ 'is-active': isChapterActive(index) }"
                    @click="jumpTo(chapter.page)"
                  >
                    <span>{{ chapter.title }}</span>
                    <em>{{ chapter.page }}</em>
                  </button>
                  <ul v-if="chapter.children?.length">
                    <li v-for="section in chapter.children ?? []" :key="section.title">
                      <button
                        type="button"
                        class="cat-row"
                        :class="{ 'is-active': isSectionActive(section.page) }"
                        @click="jumpTo(section.page)"
                      >
                        <span>{{ section.title }}</span>
                        <em>{{ section.page }}</em>
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </aside>
          </div>

          <footer class="reader-foot">
            <div class="reader-progress">
              <i :style="{ width: `${(activePageNo / total) * 100}%` }"></i>
            </div>
            <div class="reader-foot__meta">
              <p>{{ book.id }} · {{ book.collectionUnit }}</p>
              <p>第 {{ activePageNo }} / {{ total }} 页</p>
            </div>
            <div class="reader-foot__actions">
              <button type="button" class="reader-btn" title="重置封面" @click="resetCover">
                <el-icon><RefreshLeft /></el-icon>
                <span>重置封面</span>
              </button>
            </div>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.reader-mask {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3vh 2vw;
  background: rgba(6, 20, 28, 0.74);
  backdrop-filter: blur(3px);
}

.reader {
  display: flex;
  flex-direction: column;
  width: min(1180px, 94vw);
  height: min(880px, 92vh);
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(180deg, #0f3241, #123a4a 46%, #0a222c);
  box-shadow: 0 40px 90px rgba(5, 18, 25, 0.6);
}

/* 工具条 */
.reader-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(243, 239, 230, 0.14);

  &__group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.reader-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid rgba(243, 239, 230, 0.22);
  border-radius: 8px;
  background: rgba(243, 239, 230, 0.06);
  font-size: 13px;
  color: #e6edf0;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    border-color: rgba(216, 184, 120, 0.65);
    background: rgba(243, 239, 230, 0.14);
    color: #fff;
  }

  &.is-on {
    border-color: var(--c-gold);
    background: rgba(194, 160, 95, 0.24);
    color: #f8ecd2;
  }

  &:disabled {
    opacity: 0.34;
    cursor: not-allowed;
  }
}

.reader-jump {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #c2d2d8;

  &__input {
    width: 54px;
    padding: 6px 8px;
    border: 1px solid rgba(243, 239, 230, 0.22);
    border-radius: 6px;
    background: rgba(6, 20, 28, 0.5);
    font-size: 13px;
    text-align: center;
    color: #eef4f6;

    &:focus {
      outline: none;
      border-color: var(--c-gold);
    }
  }
}

.reader-zoom {
  min-width: 42px;
  font-size: 12.5px;
  text-align: center;
  color: #c2d2d8;
}

/* 书页舞台 */
.reader-stage {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 14px 24px;
  overflow: hidden;
}

.reader-book {
  --book-h: min(620px, 62vh);
  --book-w: calc(var(--book-h) * 1.6);

  position: relative;
  width: var(--book-w);
  height: var(--book-h);
  perspective: 2400px;
  transform-style: preserve-3d;
  transition: transform 0.26s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    z-index: 500;
    width: 30px;
    margin-left: -15px;
    background: linear-gradient(
      90deg,
      rgba(14, 47, 61, 0),
      rgba(14, 47, 61, 0.18),
      rgba(14, 47, 61, 0)
    );
    pointer-events: none;
  }

  &.is-static .reader-sheet {
    transition: none;
  }
}

.reader-sheet {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.82s cubic-bezier(0.36, 0.08, 0.24, 1);

  &.is-flipped {
    transform: rotateY(-180deg);
  }
}

.reader-face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 0 6px 6px 0;
  background: #f7f3ea;
  box-shadow: 0 18px 42px rgba(5, 18, 25, 0.32);
  backface-visibility: hidden;

  &--back {
    border-radius: 6px 0 0 6px;
    transform: rotateY(180deg);
  }
}

/* 目录面板 */
.reader-catalog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 600;
  display: flex;
  flex-direction: column;
  width: min(340px, 76vw);
  border-left: 1px solid var(--c-line);
  background: #fbf9f4;
  transform: translateX(102%);
  transition: transform 0.3s ease;
  pointer-events: none;

  &.is-open {
    pointer-events: auto;
    transform: translateX(0);
  }

  &__head {
    padding: 18px 18px 14px;
    border-bottom: 1px solid var(--c-line);

    h3 {
      font-family: var(--font-serif);
      font-size: 16px;
      font-weight: 700;
      line-height: 1.5;
      color: var(--c-primary-deep);
    }

    p {
      margin-top: 6px;
      font-size: 12px;
      color: var(--c-text-3);
    }
  }

  &__list {
    flex: 1;
    min-height: 0;
    padding: 10px 12px 18px;
    overflow: auto;
    list-style: none;
  }
}

.cat-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: none;
  font-family: var(--font-serif);
  font-size: 14px;
  text-align: left;
  color: var(--c-text-2);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--c-primary-soft);
    color: var(--c-primary);
  }

  &.is-chapter {
    font-weight: 600;
    color: var(--c-primary-deep);
  }

  &.is-active {
    background: rgba(194, 160, 95, 0.18);
    color: var(--c-primary);
  }

  em {
    flex-shrink: 0;
    font-size: 12px;
    font-style: normal;
    color: var(--c-text-3);
  }

  .reader-catalog__list ul & {
    padding-left: 26px;
    font-size: 13px;
  }
}

/* 底栏 */
.reader-foot {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 16px;
  align-items: center;
  padding: 10px 18px 14px;
  border-top: 1px solid rgba(243, 239, 230, 0.14);

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: #9db0b8;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.reader-progress {
  grid-column: 1 / -1;
  height: 3px;
  overflow: hidden;
  border-radius: 2px;
  background: rgba(243, 239, 230, 0.16);

  i {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--c-gold), var(--c-gold-light));
    transition: width 0.3s ease;
  }
}

/* 弹窗过渡 */
.reader-fade-enter-active,
.reader-fade-leave-active {
  transition: opacity 0.26s ease;
}

.reader-fade-enter-from,
.reader-fade-leave-to {
  opacity: 0;
}

@include respond-to('md') {
  .reader-book {
    --book-h: min(560px, 58vh);
  }
}

@include respond-to('xs') {
  .reader {
    width: 96vw;
    height: 94vh;
  }

  .reader-bar {
    gap: 8px;
    padding: 10px 12px;
  }

  .reader-btn {
    padding: 6px 8px;
    font-size: 12px;

    span {
      display: none;
    }
  }

  .reader-stage {
    padding: 8px;
  }

  .reader-book {
    --book-h: min(440px, 52vh);
  }
}
</style>
