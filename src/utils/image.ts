/**
 * 图片资源统一生成工具
 * 平台所有配图均由文生图服务实时生成，避免引入外部图床依赖。
 */
export type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'

const IMAGE_ENDPOINT = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

export function img(prompt: string, size: ImageSize = 'landscape_4_3'): string {
  return `${IMAGE_ENDPOINT}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`
}
