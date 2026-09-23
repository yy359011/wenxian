<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, View, Top } from '@element-plus/icons-vue'
import type { NewsItem } from '@/types'

const props = withDefaults(
  defineProps<{
    item: NewsItem
    variant?: 'feature' | 'item' | 'mini'
    highlight?: string
  }>(),
  { variant: 'item', highlight: '' }
)

defineEmits<{ (e: 'open', item: NewsItem): void }>()

/** 检索关键词高亮：命中片段用 \u0001 \u0002 包裹，切分后奇数段即命中 */
function toSegments(text: string) {
  const key = props.highlight.trim()
  if (!key) return [text]
  const safe = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text
    .replace(new RegExp(safe, 'gi'), (matched) => `\u0001${matched}\u0002`)
    .split(/[\u0001\u0002]/)
}

const titleSegments = computed(() => toSegments(props.item.title))
const summarySegments = computed(() => toSegments(props.item.summary))

/** 摘录在命中的关键词前后各保留的字符数 */
const SNIPPET_PAD = 42

/** 命中段落摘录：题名与摘要都未命中、但正文命中时，截取正文中命中的那一句 */
const snippet = computed(() => {
  const key = props.highlight.trim().toLowerCase()
  if (!key) return ''
  if (props.item.title.toLowerCase().includes(key)) return ''
  if (props.item.summary.toLowerCase().includes(key)) return ''

  for (const paragraph of props.item.content) {
    const index = paragraph.toLowerCase().indexOf(key)
    if (index === -1) continue
    const start = Math.max(0, index - SNIPPET_PAD)
    const end = Math.min(paragraph.length, index + key.length + SNIPPET_PAD)
    return `${start > 0 ? '…' : ''}${paragraph.slice(start, end)}${end < paragraph.length ? '…' : ''}`
  }
  return ''
})

const snippetSegments = computed(() => (snippet.value ? toSegments(snippet.value) : []))
</script>

<template>
  <article
    class="news-card"
    :class="[`is-${variant}`]"
    tabindex="0"
    @click="$emit('open', item)"
    @keyup.enter="$emit('open', item)"
  >
    <div v-if="variant !== 'mini'" class="news-cover">
      <img :src="item.cover" :alt="item.title" loading="lazy" />
      <span class="news-category">{{ item.category }}</span>
    </div>

    <div class="news-body">
      <h3 class="news-title">
        <el-icon v-if="item.top" class="top-flag"><Top /></el-icon>
        <template v-for="(segment, index) in titleSegments" :key="index">
          <mark v-if="index % 2 === 1">{{ segment }}</mark>
          <template v-else>{{ segment }}</template>
        </template>
      </h3>

      <p v-if="variant !== 'mini'" class="news-summary">
        <template v-for="(segment, index) in summarySegments" :key="index">
          <mark v-if="index % 2 === 1">{{ segment }}</mark>
          <template v-else>{{ segment }}</template>
        </template>
      </p>

      <p v-if="variant !== 'mini' && snippet" class="news-snippet">
        <template v-for="(segment, index) in snippetSegments" :key="index">
          <mark v-if="index % 2 === 1">{{ segment }}</mark>
          <template v-else>{{ segment }}</template>
        </template>
      </p>

      <div class="news-meta">
        <span class="meta-date"><el-icon><Calendar /></el-icon>{{ item.publishDate }}</span>
        <span class="meta-source">{{ item.source }}</span>
        <span class="meta-views"><el-icon><View /></el-icon>{{ item.views.toLocaleString() }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.news-card {
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--c-primary-soft);
    border-radius: var(--radius-md);
  }
}

.news-cover {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: linear-gradient(140deg, #dfe7e8, #c9d6d9);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
}

.news-category {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #f7f3ea;
  background: rgba(14, 47, 61, 0.72);
  backdrop-filter: blur(4px);
}

.news-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.55;
  color: var(--c-text);
  @include ellipsis(2);
}

.top-flag {
  margin-right: 4px;
  font-size: 14px;
  color: var(--c-seal);
  vertical-align: -2px;
}

.news-summary {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.85;
  color: var(--c-text-2);
  @include ellipsis(2);
}

.news-snippet {
  margin-top: 8px;
  padding-left: 10px;
  border-left: 2px solid var(--c-gold-light);
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--c-text-3);
  @include ellipsis(2);
}

.news-title mark,
.news-summary mark,
.news-snippet mark {
  color: #a8372b;
  background: rgba(216, 184, 120, 0.32);
  border-radius: 2px;
}

.news-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--c-text-3);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.meta-source {
  @include ellipsis(1);
  max-width: 160px;
}

// ---------- feature ----------
.is-feature {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--c-white);
  border: 1px solid var(--c-line);
  box-shadow: var(--shadow-sm);
  @include card-hover;

  .news-cover {
    height: 300px;
    border-radius: 0;
  }

  .news-body {
    padding: 20px 22px 22px;
  }

  .news-title {
    font-size: 21px;
    -webkit-line-clamp: 2;
  }

  &:hover .news-cover img {
    transform: scale(1.06);
  }
}

// ---------- item ----------
.is-item {
  display: flex;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px dashed var(--c-line);

  &:last-child {
    border-bottom: none;
  }

  .news-cover {
    width: 168px;
    height: 112px;
    flex-shrink: 0;
  }

  .news-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .news-meta {
    margin-top: auto;
    padding-top: 10px;
  }

  &:hover {
    .news-title {
      color: var(--c-primary);
    }

    .news-cover img {
      transform: scale(1.05);
    }
  }
}

// ---------- mini ----------
.is-mini {
  padding: 11px 0;
  border-bottom: 1px dashed var(--c-line);

  &:last-child {
    border-bottom: none;
  }

  .news-title {
    font-size: 14px;
    font-weight: 500;
    -webkit-line-clamp: 1;
    transition: color 0.24s ease;
  }

  .news-meta {
    margin-top: 6px;
    gap: 12px;
  }

  &:hover .news-title {
    color: var(--c-primary);
  }
}

// ---------- 响应式 ----------
@include respond-to('lg') {
  .is-feature .news-cover {
    height: 240px;
  }
}

@include respond-to('md') {
  .is-item .news-cover {
    width: 140px;
    height: 96px;
  }

  .is-feature .news-title {
    font-size: 19px;
  }
}

@include respond-to('xs') {
  .is-item {
    gap: 12px;

    .news-cover {
      width: 112px;
      height: 80px;
    }
  }

  .is-item .news-summary {
    display: none;
  }
}
</style>
