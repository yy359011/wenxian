import type { NewsItem } from '@/types'
import { img } from '@/utils/image'

/** 新闻资讯（示例数据） */
export const newsList: NewsItem[] = [
  {
    id: 'NEWS-2024-0056',
    title: '浙江图书馆浙江水系（大运河沿线）运河文献发布平台正式上线',
    category: '馆内动态',
    cover: img('grand opening ceremony of digital cultural archive platform in modern library hall, large LED screen, elegant Chinese interior, warm light', 'landscape_16_9'),
    summary:
      '平台首批发布台州地方文献 3200 余册、影像 1.8 万余幅、口述史视频 260 小时，实现九县市区文旅记忆资源一站式检索。',
    content: [
      '9 月 20 日上午，浙江图书馆浙江水系（大运河沿线）运河文献发布平台上线仪式在台州市图书馆举行。平台由台州市文化和广电旅游体育局指导，台州市图书馆联合九县（市、区）公共图书馆、档案馆共同建设。',
      '平台以「山海文化」为主线，按照景点、美食、人文三大主题重构地方文献知识体系，首批发布数字化文献 3200 余册、影像资料 1.8 万余幅、口述史访谈视频 260 小时。',
      '用户可通过首页全文检索框，以关键词、责任者、区域、年代等维度组合检索，也可在「关键枢纽路线图」上点选任一枢纽，直接查看该枢纽关联的全部文旅记忆文献。'
    ],
    figures: [
      {
        src: img('digital cultural archive platform launch ceremony, guests pressing launch button on stage, Chinese library auditorium, warm light', 'landscape_16_9'),
        caption: '上线仪式现场：九县（市、区）图书馆代表共同启动平台',
        after: 0
      },
      {
        src: img('rows of ancient Chinese local chronicle books being digitized, overhead book scanner in library digitization workshop', 'landscape_16_9'),
        caption: '文献数字化加工：台州地方志高精度扫描',
        after: 1
      }
    ],
    source: '台州市图书馆',
    author: '平台建设办',
    publishDate: '2026-09-20',
    views: 6842,
    top: true
  },
  {
    id: 'NEWS-2024-0055',
    title: '关于征集台州地方文献与民间历史资料的公告',
    category: '政策法规',
    cover: img('public notice document with official red seal on desk, documents and magnifier, formal official photography', 'landscape_16_9'),
    summary:
      '面向社会长期征集台州府志族谱、老照片、契约文书、票证、口述记忆等资料，经审定后统一数字化发布并颁发收藏证书。',
    content: [
      '为完整保存台州历史文化记忆，平台现面向社会各界长期征集地方文献与民间历史资料，范围包括：历代方志族谱、公私文书契约、近现代老照片与影像、票证票据、口述记忆与手稿等。',
      '所征集资料经专家审定后，由平台统一开展高精度数字化加工，原件可依捐赠人意愿返还或由市图书馆专藏保存。',
      '凡入藏资料，平台将向捐赠人颁发收藏证书，并在文献详情页标注来源信息。联系电话：0576-88888888。'
    ],
    figures: [
      {
        src: img('old Chinese family genealogy books and handwritten contracts spread on wooden table, archival collection photography', 'landscape_16_9'),
        caption: '征集范围：历代方志族谱与公私文书契约',
        after: 0
      },
      {
        src: img('librarian wearing white gloves scanning fragile old manuscript, digitization laboratory close up, soft light', 'landscape_16_9'),
        caption: '征集资料统一开展高精度数字化加工',
        after: 1
      }
    ],
    source: '台州市图书馆',
    author: '特藏部',
    publishDate: '2026-09-12',
    views: 3215,
    top: true
  },
  {
    id: 'NEWS-2024-0054',
    title: '台州府城墙申遗文献专题库完成二期建设',
    category: '地方资讯',
    cover: img('ancient Chinese city wall on mountain ridge at dawn, misty hills, heritage site photography, cinematic wide shot', 'landscape_16_9'),
    summary:
      '专题库补充明清城墙修缮碑刻拓片 168 件、测绘图 92 幅，实现城墙形态变迁的时空双维检索。',
    content: [
      '临海台州府城墙（江南长城）申遗文献专题库二期建设近日完成。二期新增明清时期城墙修缮碑刻拓片 168 件、民国测绘图 92 幅、当代保护工程档案 41 卷。',
      '专题库支持按城墙段落、修筑年代、文献类型三维检索，并接入平台统一的地理坐标索引，可在关键枢纽路线图上叠加显示。'
    ],
    figures: [
      {
        src: img('ancient Chinese city wall rampart at sunrise, Linhai Jiangnan Great Wall stone battlements, misty hills', 'landscape_16_9'),
        caption: '临海台州府城墙（江南长城）现存城段',
        after: 0
      },
      {
        src: img('rubbing of ancient stone inscription stele, Chinese calligraphy on rice paper, archival document close up', 'landscape_16_9'),
        caption: '二期新增明清城墙修缮碑刻拓片 168 件',
        after: 1
      }
    ],
    source: '临海市文物保护所',
    author: '文保所办公室',
    publishDate: '2026-09-05',
    views: 2480
  },
  {
    id: 'NEWS-2024-0051',
    title: '平台与台州学院共建地方文献数字人文实验室',
    category: '馆内动态',
    cover: img('university library digital humanities laboratory, researchers at computer workstations, book stacks background, modern academic', 'landscape_16_9'),
    summary:
      '双方将在文献知识图谱、方言语音检索、古籍 OCR 校勘等方向开展联合研究与技术攻关。',
    content: [
      '平台与台州学院人文学院签署共建协议，成立地方文献数字人文实验室。',
      '实验室将围绕台州地方文献知识图谱构建、台州方言语音检索、古籍 OCR 自动校勘三个方向开展联合研究，成果优先在平台落地应用。'
    ],
    figures: [
      {
        src: img('signing ceremony of university and library cooperation agreement, two parties shaking hands, conference room', 'landscape_16_9'),
        caption: '平台与台州学院签署共建协议',
        after: 0
      },
      {
        src: img('digital humanities laboratory, researchers analyzing knowledge graph on large screen, book stacks background', 'landscape_16_9'),
        caption: '地方文献数字人文实验室研究方向',
        after: 1
      }
    ],
    source: '台州学院',
    author: '科研处',
    publishDate: '2026-08-06',
    views: 1620
  },
  {
    id: 'NEWS-2024-0050',
    title: '黄岩蜜橘橘文化文献专题完成数字化加工',
    category: '地方资讯',
    cover: img('mandarin orange orchard in Zhejiang China, farmers harvesting, citrus trees rows, golden afternoon light, documentary', 'landscape_16_9'),
    summary:
      '新增橘文化文献 486 件，涵盖橘园契税文书、橘酪制作工艺与近现代柑橘科研档案。',
    content: [
      '黄岩区图书馆完成橘文化文献专题数字化加工，新增文献 486 件。',
      '专题涵盖清代至民国的橘园契税文书、橘酪制作工艺手稿，以及 1950 年代以来柑橘品种选育科研档案，其中多份档案为首次公开。'
    ],
    figures: [
      {
        src: img('librarian cataloging historical documents in library special collections room, shelves of old books', 'landscape_16_9'),
        caption: '黄岩区图书馆特藏部文献整理现场',
        after: 0
      },
      {
        src: img('mandarin orange orchard in Huangyan Zhejiang, farmers harvesting, citrus trees rows, golden afternoon light', 'landscape_16_9'),
        caption: '橘文化专题：橘园契税文书与柑橘科研档案',
        after: 1
      }
    ],
    source: '黄岩区图书馆',
    author: '特藏部',
    publishDate: '2026-07-25',
    views: 1394
  },
  {
    id: 'NEWS-2024-0049',
    title: '关于平台文献资源使用与版权申明的通知',
    category: '政策法规',
    cover: img('official legal documents with seal and stamp, copyright statement paperwork on wooden table, formal photography', 'landscape_16_9'),
    summary:
      '平台文献仅限学习研究使用，商业用途须获授权；如权利人认为内容存在侵权，可通过邮箱申请下架。',
    content: [
      '为规范平台文献资源使用，现就版权事项通知如下：平台所发布数字化文献仅限个人学习、教学科研等非商业用途，商业用途须事先取得书面授权。',
      '如权利人认为平台内容侵犯其合法权益，请通过邮箱 archive@taizhou-lib.cn 提交权属证明，平台将在 3 个工作日内核实处理。'
    ],
    figures: [
      {
        src: img('copyright notice document on wooden desk with official red seal, legal paperwork, formal photography', 'landscape_16_9'),
        caption: '平台文献资源版权使用说明',
        after: 0
      },
      {
        src: img('copyright claim submission letter and envelope on office desk, computer screen with email inbox', 'landscape_16_9'),
        caption: '权利主张可通过邮箱提交权属证明',
        after: 1
      }
    ],
    source: '台州市图书馆',
    author: '法务与版权组',
    publishDate: '2026-07-10',
    views: 1055
  }
]

/** 新闻分类筛选项 */
export const newsCategories: Array<'全部' | NewsItem['category']> = [
  '全部',
  '政策法规',
  '馆内动态',
  '地方资讯'
]

/** 热门关键词（首页检索框提示） */
export const hotKeywords = ['台州府志', '海门港', '大陈岛', '天台山', '黄岩蜜橘', '石塘渔俗', '盐运文书']
