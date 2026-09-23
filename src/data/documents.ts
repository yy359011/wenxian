import type { DocumentItem } from '@/types'
import { img } from '@/utils/image'

/** 文献资源库（示例数据，接口层可无缝替换为真实服务） */
export const documents: DocumentItem[] = [
  {
    id: 'TZ-TS-0001',
    title: '台州府志（明嘉靖刻本）',
    type: '古籍文献',
    source: '临海市图书馆藏明嘉靖刻本（影印）',
    region: '临海',
    era: '明代',
    cover: img('ancient Chinese woodblock printed local gazetteer book, yellowed rice paper pages, thread binding, museum archive photography, top down', 'portrait_4_3'),
    summary:
      '明嘉靖年间纂修的台州府志，完整记载台州府辖域山川、城池、赋役、人物与艺文，是研究台州地方史的核心文献。',
    tags: ['府志', '古籍', '方志'],
    author: '王廷干 等 纂修',
    collectionUnit: '临海市图书馆',
    publishDate: '2024-03-18',
    views: 4821,
    featured: true,
    fileFormat: 'PDF',
    fileSize: '186 MB'
  },
  {
    id: 'TZ-TS-0002',
    title: '民国时期海门港码头影像集',
    type: '影印古籍',
    source: '台州市档案馆藏原版胶片',
    region: '椒江',
    era: '民国',
    cover: img('vintage sepia photograph of Chinese coastal harbor pier in 1930s, wooden boats, cargo workers, old city street, archival document texture', 'landscape_4_3'),
    summary:
      '收录 1928—1948 年间海门港码头、轮船航班与海门老街的珍贵影像 132 幅，直观呈现台州湾近代开埠面貌。',
    tags: ['老照片', '港口', '开埠'],
    author: '台州市档案馆 编',
    collectionUnit: '台州市档案馆',
    publishDate: '2024-05-06',
    views: 3610,
    featured: true,
    fileFormat: 'JPG',
    fileSize: '96 MB'
  },
  {
    id: 'TZ-TS-0003',
    title: '大陈岛垦荒纪实（1956—1960）',
    type: '现代文献',
    source: '台州广播电视台影像资料库',
    region: '椒江',
    era: '当代',
    cover: img('documentary still frame of young Chinese volunteers reclaiming farmland on offshore island in 1950s, black and white film grain, sea cliff', 'landscape_4_3'),
    summary:
      '以口述史与新闻纪录影像还原大陈岛垦荒队五年创业历程，含第一代垦荒队员访谈实录 46 段。',
    tags: ['垦荒精神', '口述史', '纪录片'],
    author: '台州广播电视台',
    collectionUnit: '台州市图书馆',
    publishDate: '2023-11-20',
    views: 5288,
    featured: true,
    fileFormat: 'MP4',
    fileSize: '2.4 GB'
  },
  {
    id: 'TZ-TS-0004',
    title: '天台山方外志要',
    type: '古籍文献',
    source: '天台县图书馆藏清康熙刻本（影印）',
    region: '天台',
    era: '清代',
    cover: img('antique Chinese mountain temple gazetteer, traditional ink painting of misty buddhist temple in mountains, aged paper cover, studio light', 'portrait_4_3'),
    summary:
      '清康熙年间成书，记述天台山寺院沿革、山志形胜与高僧行迹，附山图十二幅，为天台宗研究重要底本。',
    tags: ['山志', '天台宗', '国清寺'],
    author: '释传灯',
    collectionUnit: '天台县图书馆',
    publishDate: '2024-01-09',
    views: 2740,
    fileFormat: 'PDF',
    fileSize: '142 MB'
  },
  {
    id: 'TZ-TS-0005',
    title: '黄岩蜜橘栽培技艺图谱',
    type: '现代文献',
    source: '黄岩区农业农村局技术资料室',
    region: '黄岩',
    era: '当代',
    cover: img('traditional Chinese citriculture illustrated manual, mandarin oranges on tree, ink and color painting plates, botanical illustration', 'landscape_4_3'),
    summary:
      '以传统图谱形式系统梳理黄岩蜜橘选种、嫁接、橘园管理与桔酪制作技艺，含手绘彩图 78 幅。',
    tags: ['蜜橘', '农艺', '非遗'],
    author: '黄岩区农业农村局',
    collectionUnit: '黄岩区图书馆',
    publishDate: '2024-06-12',
    views: 1988,
    fileFormat: 'JPG',
    fileSize: '64 MB'
  },
  {
    id: 'TZ-TS-0006',
    title: '台州府城墙保护修缮工程报告',
    type: '现代文献',
    source: '临海市文物保护所工程档案',
    region: '临海',
    era: '当代',
    cover: img('ancient Chinese city wall along mountain ridge, restoration survey drawing, architectural blueprints, overcast sky', 'portrait_4_3'),
    summary:
      '系统记录台州府城墙（江南长城）本体勘察、形制测绘与修缮工艺，含 1:200 实测图与夯土工艺记录。',
    tags: ['城墙', '修缮', '测绘'],
    author: '临海市文物保护所',
    collectionUnit: '临海市博物馆',
    publishDate: '2023-09-28',
    views: 1560,
    fileFormat: 'PDF',
    fileSize: '308 MB'
  },
  {
    id: 'TZ-TS-0007',
    title: '石塘渔村民俗影像志',
    type: '现代文献',
    source: '温岭市文化馆民俗影像采集项目',
    region: '温岭',
    era: '当代',
    cover: img('Chinese fishing village stone houses on coastal cliff, sunrise over East China Sea, fishermen mending nets, documentary photography', 'landscape_4_3'),
    summary:
      '记录石塘渔村开渔节、七夕小人节、石屋营造等民俗活动，含 4K 影像 96 分钟与方言字幕。',
    tags: ['渔俗', '七夕', '石屋'],
    author: '温岭市文化馆',
    collectionUnit: '温岭市图书馆',
    publishDate: '2024-04-02',
    views: 2264,
    fileFormat: 'MP4',
    fileSize: '1.8 GB'
  },
  {
    id: 'TZ-TS-0008',
    title: '仙居皤滩古镇盐运文书',
    type: '古籍文献',
    source: '仙居县档案馆民间征集文契',
    region: '仙居',
    era: '清代',
    cover: img('stack of Qing dynasty Chinese merchant contracts and account books, handwritten calligraphy on aged paper, warm lamp light', 'landscape_4_3'),
    summary:
      '整理皤滩古镇盐号往来文契、账簿与商路凭据 213 件，还原浙东南盐运商道运行实态。',
    tags: ['盐运', '文书', '商道'],
    author: '仙居县档案馆',
    collectionUnit: '仙居县图书馆',
    publishDate: '2023-08-15',
    views: 1302,
    fileFormat: 'PDF',
    fileSize: '224 MB'
  },
  {
    id: 'TZ-TS-0009',
    title: '三门青蟹养殖口述档案',
    type: '现代文献',
    source: '三门县水产技术推广站口述采集',
    region: '三门',
    era: '当代',
    cover: img('Chinese mud crab aquaculture pond at dusk, fisherman holding crab, coastal mudflat, warm documentary light', 'landscape_4_3'),
    summary:
      '访谈三门湾三代养蟹人，记录青蟹围塘养殖技术演进与三门青蟹品牌成长历程。',
    tags: ['青蟹', '口述史', '海产'],
    author: '三门县水产技术推广站',
    collectionUnit: '三门县图书馆',
    publishDate: '2024-02-27',
    views: 1176,
    fileFormat: 'MP4',
    fileSize: '920 MB'
  },
  {
    id: 'TZ-TS-0010',
    title: '路桥十里长街商贸老照片',
    type: '影印古籍',
    source: '路桥区档案馆民间捐赠影像',
    region: '路桥',
    era: '民国',
    cover: img('old photograph of Chinese canal street market town with wooden shopfronts and stone bridge, ox carts, 1930s sepia', 'landscape_4_3'),
    summary:
      '精选 1900—1949 年南官河沿岸商铺、桥埠与行帮影像 158 幅，勾勒浙东南商埠市井图景。',
    tags: ['商埠', '老街', '影像'],
    author: '路桥区档案馆',
    collectionUnit: '路桥区图书馆',
    publishDate: '2024-07-19',
    views: 1455,
    fileFormat: 'JPG',
    fileSize: '88 MB'
  },
  {
    id: 'TZ-TS-0011',
    title: '玉环坎门渔港船帮文书辑存',
    type: '影印古籍',
    source: '玉环市档案馆藏船帮文书原件',
    region: '玉环',
    era: '民国',
    cover: img('bundled Chinese fishing guild documents with red seals, fishing boat register ledger, aged paper, archive table', 'portrait_4_3'),
    summary:
      '辑录坎门渔港船帮组织章程、渔船登记与渔获分成契约 176 件，反映东海渔帮治理传统。',
    tags: ['渔帮', '契约', '海俗'],
    author: '玉环市档案馆',
    collectionUnit: '玉环市图书馆',
    publishDate: '2023-12-04',
    views: 986,
    fileFormat: 'PDF',
    fileSize: '156 MB'
  },
  {
    id: 'TZ-TS-0012',
    title: '台州山海风味食单',
    type: '现代文献',
    source: '台州市餐饮行业协会田野调查',
    region: '椒江',
    era: '当代',
    cover: img('traditional Zhejiang coastal seafood dishes on rustic ceramic plates, steamed crab, fish soup, overhead food photography, warm tones', 'landscape_4_3'),
    summary:
      '以「一县一席」为体例整理台州九县市区代表菜点，附食材考、食俗考与手绘食单 62 幅。',
    tags: ['食单', '食材', '食俗'],
    author: '台州市餐饮行业协会',
    collectionUnit: '台州市图书馆',
    publishDate: '2024-08-08',
    views: 3072,
    featured: true,
    fileFormat: 'JPG',
    fileSize: '112 MB'
  }
]

/** 区域筛选项 */
export const regionOptions = [
  '全部',
  '椒江',
  '黄岩',
  '路桥',
  '临海',
  '温岭',
  '玉环',
  '天台',
  '仙居',
  '三门'
]

/** 年代筛选项 */
export const eraOptions = ['全部', '明代', '清代', '民国', '当代']

/** 分类筛选项 */
export const typeOptions: Array<'全部' | DocumentItem['type']> = [
  '全部',
  '现代文献',
  '古籍文献',
  '影印古籍'
]
