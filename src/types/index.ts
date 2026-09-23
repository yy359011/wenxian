/** 平台通用类型定义 */

/** 文献分类 */
export type DocType = '现代文献' | '古籍文献' | '影印古籍'

/** 新闻分类 */
export type NewsCategory = '政策法规' | '馆内动态' | '地方资讯'

/** 文献资源 */
export interface DocumentItem {
  id: string
  title: string
  type: DocType
  /** 文献来源 */
  source: string
  /** 归属区域：椒江 / 黄岩 / 路桥 / 临海 / 温岭 / 玉环 / 天台 / 仙居 / 三门 */
  region: string
  /** 年代，如「明代」「民国」「当代」 */
  era: string
  cover: string
  summary: string
  tags: string[]
  /** 责任者 */
  author: string
  /** 收藏单位 */
  collectionUnit: string
  publishDate: string
  views: number
  /** 是否特色馆藏重点推荐 */
  featured?: boolean
  fileFormat: string
  fileSize: string
}

/** 书页类型 */
export type BookLeafKind = 'cover' | 'title' | 'catalog' | 'plate' | 'text' | 'copyright'

/** 书籍目录节点（两级） */
export interface BookCatalogNode {
  title: string
  /** 对应页码，从 1 开始 */
  page: number
  /** 二级目录 */
  children?: BookCatalogNode[]
}

/** 书籍单页 */
export interface BookLeafPage {
  kind: BookLeafKind
  /** 页眉标题 */
  heading?: string
  /** 正文段落 */
  paragraphs?: string[]
  /** 图版地址 */
  plate?: string
  /** 图版说明 */
  caption?: string
  /** 页码，从 1 开始 */
  pageNo: number
}

/** 可翻阅文献 */
export interface BookDocument extends DocumentItem {
  catalog: BookCatalogNode[]
  pages: BookLeafPage[]
}

/** 资讯正文插图 */
export interface NewsFigure {
  src: string
  caption: string
  /** 插入位置：展示在该序号的正文段落之后（从 0 开始） */
  after: number
}

/** 新闻资讯 */
export interface NewsItem {
  id: string
  title: string
  category: NewsCategory
  cover: string
  summary: string
  content: string[]
  /** 正文插图（图文结合排版） */
  figures?: NewsFigure[]
  source: string
  author: string
  publishDate: string
  views: number
  /** 是否置顶 */
  top?: boolean
}

/** 检索结果 */
export interface SearchResult {
  list: DocumentItem[]
  total: number
}
