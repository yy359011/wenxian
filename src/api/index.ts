import type { DocumentItem, NewsItem, SearchResult } from '@/types'
import { documents } from '@/data/documents'
import { newsList } from '@/data/news'

/**
 * 数据接口层（Mock 实现）
 * 所有方法均返回 Promise，后续可直接替换为真实 HTTP 请求而无需改动组件。
 */
const delay = (ms = 320) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export interface DocQuery {
  title?: string
  author?: string
  keyword?: string
  type?: string
  region?: string
  era?: string
  page?: number
  pageSize?: number
}

export interface NewsQuery {
  keyword?: string
  category?: string
  page?: number
  pageSize?: number
}

const isAll = (value?: string) => !value || value === '全部'

/** 题名、责任者按包含关系模糊匹配 */
const includesKey = (source: string, value?: string) => {
  const key = value?.trim().toLowerCase()
  return !key || source.toLowerCase().includes(key)
}

function matchKeyword(item: DocumentItem, keyword: string) {
  const key = keyword.trim().toLowerCase()
  if (!key) return true
  return [
    item.title,
    item.summary,
    item.author,
    item.region,
    item.era,
    item.type,
    item.source,
    item.collectionUnit,
    ...item.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(key)
}

/** 全文检索 / 多条件筛选文献资源 */
export async function fetchDocuments(query: DocQuery = {}): Promise<SearchResult> {
  await delay()
  const {
    title,
    author,
    keyword = '',
    type,
    region,
    era,
    page = 1,
    pageSize = 8
  } = query

  const filtered = documents.filter((item) => {
    if (!includesKey(item.title, title)) return false
    if (!includesKey(item.author, author)) return false
    if (!matchKeyword(item, keyword)) return false
    if (!isAll(type) && item.type !== type) return false
    if (!isAll(region) && item.region !== region) return false
    if (!isAll(era) && item.era !== era) return false
    return true
  })

  const start = (page - 1) * pageSize
  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length
  }
}

/** 按 id 获取单条文献详情 */
export async function fetchDocumentById(id: string): Promise<DocumentItem | undefined> {
  await delay(200)
  return documents.find((item) => item.id === id)
}

/** 首页推荐文献（特色馆藏） */
export async function fetchFeaturedDocuments(limit = 6): Promise<DocumentItem[]> {
  await delay(260)
  const featured = documents.filter((item) => item.featured)
  const rest = documents.filter((item) => !item.featured)
  return [...featured, ...rest].slice(0, limit)
}

/** 按文献类别获取文献（首页类别切换） */
export async function fetchDocumentsByType(type: string, limit = 4): Promise<DocumentItem[]> {
  await delay(240)
  if (isAll(type)) return documents.slice(0, limit)
  return documents.filter((item) => item.type === type).slice(0, limit)
}

/** 按枢纽区域获取文献 */
export async function fetchDocumentsByRegion(region: string, limit = 4): Promise<DocumentItem[]> {
  await delay(200)
  return documents.filter((item) => item.region === region).slice(0, limit)
}

/** 新闻列表 */
export async function fetchNews(
  query: NewsQuery = {}
): Promise<{ list: NewsItem[]; total: number }> {
  await delay()
  const { keyword = '', category, page = 1, pageSize = 6 } = query
  const key = keyword.trim().toLowerCase()

  const filtered = newsList.filter((item) => {
    if (!isAll(category) && item.category !== category) return false
    if (!key) return true
    return [item.title, item.summary, item.source, item.author, item.category, ...item.content]
      .join(' ')
      .toLowerCase()
      .includes(key)
  })

  const start = (page - 1) * pageSize
  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length
  }
}

/** 首页资讯（置顶优先） */
export async function fetchLatestNews(limit = 5): Promise<NewsItem[]> {
  await delay(260)
  const top = newsList.filter((item) => item.top)
  const rest = newsList.filter((item) => !item.top)
  return [...top, ...rest].slice(0, limit)
}

/** 新闻详情 */
export async function fetchNewsById(id: string): Promise<NewsItem | undefined> {
  await delay(200)
  return newsList.find((item) => item.id === id)
}

/** 平台数据概览 */
export async function fetchPlatformStats(): Promise<
  Array<{ label: string; value: number; unit: string }>
> {
  await delay(200)
  return [
    { label: '数字化文献', value: 3246, unit: '册' },
    { label: '影像资料', value: 18620, unit: '幅' },
    { label: '口述史影像', value: 260, unit: '小时' },
    { label: '山海枢纽', value: 9, unit: '处' }
  ]
}

export type { DocumentItem, NewsItem }
