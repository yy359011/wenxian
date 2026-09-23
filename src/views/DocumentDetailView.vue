<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Reading } from '@element-plus/icons-vue'
import PageBanner from '@/components/common/PageBanner.vue'
import DocumentReader from '@/components/common/DocumentReader.vue'
import { fetchDocumentById } from '@/api'
import type { DocumentItem } from '@/types'

const route = useRoute()
const router = useRouter()

const item = ref<DocumentItem | null>(null)
const loading = ref(true)
const readerVisible = ref(false)

/** 著录信息 */
const infoRows = computed(() => {
  const data = item.value
  if (!data) return []
  return [
    { label: '文献类别', value: data.type },
    { label: '来源', value: data.source },
    { label: '归属区域', value: data.region },
    { label: '文献年代', value: data.era },
    { label: '作者', value: data.author },
    { label: '收藏单位', value: data.collectionUnit },
    { label: '出版日期', value: data.publishDate },
    { label: '文件格式', value: data.fileFormat },
    { label: '文件大小', value: data.fileSize }
  ]
})

async function load(id: string) {
  loading.value = true
  item.value = (await fetchDocumentById(id)) ?? null
  loading.value = false
}

function goDocuments() {
  router.push({ name: 'documents' })
}

onMounted(() => {
  load(String(route.params.id))
})

watch(
  () => route.params.id,
  (id) => {
    readerVisible.value = false
    load(String(id))
  }
)
</script>

<template>
  <div class="detail-view">
    <PageBanner
      eyebrow="COLLECTION · 文献详情"
      title="文献详情"
      desc="查阅文献著录信息与内容简介，点击「在线阅读」进入翻书阅读。"
    >
      <el-button class="banner-back" :icon="ArrowLeft" @click="goDocuments">
        返回文献资源
      </el-button>
    </PageBanner>

    <div class="detail-body">
      <div class="detail-inner">
        <el-skeleton v-if="loading" :rows="6" animated />

        <div v-else-if="item" class="detail-grid">
          <aside class="detail-aside">
            <div class="aside-cover">
              <img :src="item.cover" :alt="item.title" />
            </div>
            <el-button
              type="primary"
              size="large"
              class="read-btn"
              :icon="Reading"
              @click="readerVisible = true"
            >
              在线阅读
            </el-button>
            <p class="aside-tip">支持翻页、目录跳转、比例缩放与自动播放</p>
          </aside>

          <div class="detail-main panel">
            <span class="detail-type">{{ item.type }}</span>
            <h1 class="detail-title">{{ item.title }}</h1>

            <p class="detail-summary">{{ item.summary }}</p>

            <dl class="detail-info">
              <div v-for="row in infoRows" :key="row.label" class="info-row">
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <el-empty v-else description="未找到该文献资源">
          <el-button type="primary" plain round @click="goDocuments">返回文献资源列表</el-button>
        </el-empty>
      </div>
    </div>

    <DocumentReader v-model="readerVisible" :item="item" />
  </div>
</template>

<style scoped lang="scss">
.banner-back {
  color: #f7f3ea;
  background: rgba(247, 243, 234, 0.12);
  border-color: rgba(247, 243, 234, 0.28);

  &:hover,
  &:focus {
    color: #fdf6e6;
    background: rgba(247, 243, 234, 0.2);
    border-color: rgba(216, 184, 120, 0.6);
  }
}

.detail-body {
  padding: 40px 0 76px;
}

.detail-inner {
  @include page-container;
}

.detail-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  align-items: start;
}

// ---------- 封面与操作 ----------
.detail-aside {
  padding: 18px;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.aside-cover {
  overflow: hidden;
  height: 300px;
  border-radius: var(--radius-md);
  background: linear-gradient(140deg, #dfe7e8, #c9d6d9);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.read-btn {
  width: 100%;
  margin-top: 18px;
  letter-spacing: 0.08em;
}

.aside-tip {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.8;
  text-align: center;
  color: var(--c-text-3);
}

// ---------- 著录信息 ----------
.detail-main {
  padding: 28px 30px 30px;
}

.detail-type {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--c-primary);
  background: var(--c-primary-soft);
}

.detail-title {
  margin-top: 12px;
  font-family: var(--font-serif);
  font-size: 27px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: var(--c-primary-deep);
}

.detail-summary {
  margin-top: 20px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--c-gold);
  background: rgba(194, 160, 95, 0.08);
  font-size: 14px;
  line-height: 1.95;
  color: var(--c-text-2);
}

.detail-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px dashed var(--c-line);
}

.info-row {
  display: flex;
  gap: 12px;
  padding: 9px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  dt {
    flex-shrink: 0;
    width: 76px;
    color: var(--c-text-3);
  }

  dd {
    color: var(--c-text);
  }
}

// ---------- 响应式 ----------
@include respond-to('md') {
  .detail-grid {
    grid-template-columns: 260px 1fr;
    gap: 22px;
  }

  .aside-cover {
    height: 250px;
  }

  .detail-main {
    padding: 22px 22px 24px;
  }

  .detail-title {
    font-size: 22px;
  }

  .detail-info {
    grid-template-columns: 1fr;
  }
}

@include respond-to('xs') {
  .detail-body {
    padding: 26px 0 56px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .aside-cover {
    height: 220px;
  }
}
</style>
