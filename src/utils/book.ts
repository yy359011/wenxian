/**
 * 文献翻阅数据生成工具
 * 依据文献著录信息生成两级目录与书页内容，供翻书阅读器展示。
 */
import { img } from '@/utils/image'
import type { BookCatalogNode, BookDocument, BookLeafPage, DocumentItem } from '@/types'

interface ChapterOutline {
  title: string
  sections: string[]
  platePrompt: string
}

const OUTLINE: ChapterOutline[] = [
  {
    title: '卷一 · 舆图与形胜',
    sections: ['境域总图', '山川脉络', '城郭街巷'],
    platePrompt:
      'antique Chinese hand-painted regional map scroll, ink mountains and rivers, yellowed silk paper, museum archive photography'
  },
  {
    title: '卷二 · 建置与沿革',
    sections: ['历代沿革', '公署与学宫', '津梁与水利'],
    platePrompt:
      'ancient Chinese yamen and academy architecture ink line drawing on aged paper, architectural elevation scroll'
  },
  {
    title: '卷三 · 食货与风物',
    sections: ['物产志略', '岁时风俗', '商旅往来'],
    platePrompt:
      'traditional Chinese market and fishing harbor scene painting, muted ink and mineral colors, old album leaf'
  },
  {
    title: '卷四 · 人物与艺文',
    sections: ['先贤列传', '金石碑刻', '诗文辑存'],
    platePrompt:
      'ancient Chinese stone stele rubbings and calligraphy album pages, black ink on rice paper, archival scan'
  }
]

/** 正文页段落 */
function buildParagraphs(item: DocumentItem, chapter: string, section: string): string[] {
  return [
    `本页据《${item.title}》影印件整理，记${item.region}「${section}」一门，隶于${chapter}。原书成于${item.era}，属${item.type}，现藏${item.collectionUnit}。`,
    item.summary,
    `本门所录以原书编次为序，条目之下间附按语。数字化过程对页面作了去污、纠偏与灰度增强处理，文本层仅供检索之用，引用请核对原书影印件。`
  ]
}

/** 版权与著录页段落 */
function buildColophon(item: DocumentItem): string[] {
  return [
    `责任者：${item.author}`,
    `收藏单位：${item.collectionUnit}`,
    `文献类别：${item.type}`,
    `区域年代：${item.region} · ${item.era}`,
    `文件规格：${item.fileFormat} · ${item.fileSize}`,
    `数字化日期：${item.publishDate}`,
    `累计浏览：${item.views.toLocaleString()} 次`,
    `本阅读器为演示版本，书页内容为示意文本。`
  ]
}

/** 生成可翻阅文献（目录 + 书页） */
export function buildBook(item: DocumentItem): BookDocument {
  const pages: BookLeafPage[] = []

  const push = (leaf: Omit<BookLeafPage, 'pageNo'>): number => {
    pages.push({ ...leaf, pageNo: pages.length + 1 })
    return pages.length
  }

  push({ kind: 'cover', heading: item.title, plate: item.cover, caption: item.type })
  push({
    kind: 'title',
    heading: item.title,
    paragraphs: [`${item.author}`, `${item.collectionUnit} 藏`, item.tags.map((tag) => `#${tag}`).join('　')]
  })
  push({ kind: 'catalog', heading: '目 录' })

  const catalog: BookCatalogNode[] = OUTLINE.map((chapter) => {
    const platePage = push({
      kind: 'plate',
      heading: chapter.title,
      plate: img(chapter.platePrompt, 'landscape_4_3'),
      caption: `${chapter.title}　书影`
    })
    const children = chapter.sections.map<BookCatalogNode>((section) => ({
      title: section,
      page: push({
        kind: 'text',
        heading: section,
        paragraphs: buildParagraphs(item, chapter.title, section)
      })
    }))
    return { title: chapter.title, page: platePage, children }
  })

  push({ kind: 'copyright', heading: '版权与著录', paragraphs: buildColophon(item) })

  return { ...item, catalog, pages }
}
