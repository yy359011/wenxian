<script setup lang="ts">
import { computed } from 'vue'
import { View, Collection } from '@element-plus/icons-vue'
import type { DocumentItem } from '@/types'

const props = withDefaults(
  defineProps<{
    item: DocumentItem
    mode?: 'grid' | 'list' | 'compact'
    highlight?: string
  }>(),
  { mode: 'grid', highlight: '' }
)

defineEmits<{ (e: 'open', item: DocumentItem): void }>()

const typeClass = computed(() => {
  const map: Record<string, string> = {
    现代文献: 'is-modern',
    古籍文献: 'is-ancient',
    影印古籍: 'is-reprint'
  }
  return map[props.item.type] ?? 'is-modern'
})

/** 检索关键词高亮：命中片段用 \u0001 \u0002 包裹，切分后奇数段即命中 */
function toSegments(text: string) {
  const key = props.highlight.trim()
  if (!key) return [text]
  const safe = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(safe, 'gi'), (matched) => `\u0001${matched}\u0002`).split(/[\u0001\u0002]/)
}

const titleSegments = computed(() => toSegments(props.item.title))
const summarySegments = computed(() => toSegments(props.item.summary))
</script>

<template>
  <article
    class="resource-card"
    :class="[`is-${mode}`]"
    tabindex="0"
    @click="$emit('open', item)"
    @keyup.enter="$emit('open', item)"
  >
    <div class="card-cover">
      <img :src="item.cover" :alt="item.title" loading="lazy" />
      <span class="cover-type" :class="typeClass">{{ item.type }}</span>
      <div class="cover-mask">
        <el-icon><View /></el-icon>
        <span>查看详情</span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-title">
        <template v-for="(segment, index) in titleSegments" :key="index">
          <mark v-if="index % 2 === 1">{{ segment }}</mark>
          <template v-else>{{ segment }}</template>
        </template>
      </h3>

      <p class="card-summary">
        <template v-for="(segment, index) in summarySegments" :key="index">
          <mark v-if="index % 2 === 1">{{ segment }}</mark>
          <template v-else>{{ segment }}</template>
        </template>
      </p>

      <div class="card-meta">
        <span class="meta-region">{{ item.region }} · {{ item.era }}</span>
        <span v-if="mode !== 'compact'" class="meta-unit">
          <el-icon><Collection /></el-icon>{{ item.collectionUnit }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.resource-card {
  display: flex;
  overflow: hidden;
  cursor: pointer;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  outline: none;
  @include card-hover;

  &:focus-visible {
    border-color: var(--c-primary);
    box-shadow: 0 0 0 3px var(--c-primary-soft);
  }
}

// ---------- 封面 ----------
.card-cover {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(140deg, #dfe7e8, #c9d6d9);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
}

.cover-type {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #f7f3ea;
  backdrop-filter: blur(4px);
  background: rgba(29, 91, 110, 0.88);

  &.is-ancient {
    background: rgba(168, 55, 43, 0.88);
  }

  &.is-reprint {
    background: rgba(87, 76, 154, 0.88);
  }
}

.cover-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: #f7f3ea;
  background: rgba(14, 47, 61, 0.62);
  opacity: 0;
  transition: opacity 0.36s ease;

  .el-icon {
    font-size: 22px;
  }
}

// ---------- 主体 ----------
.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: 18px 20px 16px;
}

.card-title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--c-text);
  @include ellipsis(2);

  mark {
    color: #a8372b;
    background: rgba(216, 184, 120, 0.32);
    border-radius: 2px;
  }
}

.card-summary {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.85;
  color: var(--c-text-2);
  @include ellipsis(2);

  mark {
    color: #a8372b;
    background: rgba(216, 184, 120, 0.32);
    border-radius: 2px;
  }
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding-top: 14px;
  font-size: 12px;
  color: var(--c-text-3);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.meta-region {
  padding: 2px 10px;
  border-radius: 10px;
  color: var(--c-primary);
  background: var(--c-primary-soft);
}

.meta-unit {
  @include ellipsis(1);
}

// ---------- grid 模式 ----------
.is-grid {
  flex-direction: column;

  .card-cover {
    height: 190px;
  }

  &:hover .card-cover img {
    transform: scale(1.07);
  }

  &:hover .cover-mask {
    opacity: 1;
  }
}

// ---------- list 模式 ----------
.is-list {
  align-items: stretch;

  .card-cover {
    width: 260px;
    height: 178px;
  }

  .card-body {
    padding: 20px 24px;
  }

  .card-title {
    font-size: 19px;
    -webkit-line-clamp: 1;
  }

  .card-summary {
    -webkit-line-clamp: 3;
    max-width: 780px;
  }

  &:hover .card-cover img {
    transform: scale(1.05);
  }

  &:hover .cover-mask {
    opacity: 1;
  }
}

// ---------- compact 模式 ----------
.is-compact {
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius-md);

  .card-cover {
    width: 108px;
    height: 76px;
    border-radius: var(--radius-sm);
  }

  .card-body {
    padding: 0;
    justify-content: center;
  }

  .card-title {
    font-size: 15px;
    -webkit-line-clamp: 1;
  }

  .card-summary {
    display: none;
  }

  .card-meta {
    padding-top: 8px;
    gap: 10px;
  }
}

// ---------- 响应式 ----------
@include respond-to('xl') {
  .is-grid .card-cover {
    height: 172px;
  }

  .is-list .card-cover {
    width: 220px;
    height: 156px;
  }
}

@include respond-to('md') {
  .is-list {
    .card-cover {
      width: 180px;
      height: 140px;
    }

    .card-summary {
      -webkit-line-clamp: 2;
    }
  }
}

@include respond-to('xs') {
  .is-list {
    flex-direction: column;

    .card-cover {
      width: 100%;
      height: 168px;
    }
  }

  .card-summary {
    -webkit-line-clamp: 3;
  }
}
</style>
