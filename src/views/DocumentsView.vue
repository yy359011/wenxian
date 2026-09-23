<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Refresh, Grid, List, ArrowRight } from '@element-plus/icons-vue'
import PageBanner from '@/components/common/PageBanner.vue'
import ResourceCard from '@/components/common/ResourceCard.vue'
import { fetchDocuments } from '@/api'
import { eraOptions, regionOptions, typeOptions } from '@/data/documents'
import type { DocumentItem } from '@/types'

const route = useRoute()
const router = useRouter()

const filters = ref({
  title: '',
  author: '',
  keyword: '',
  type: '全部',
  region: '全部',
  era: '全部'
})

const page = ref(1)
const pageSize = 8
const viewMode = ref<'grid' | 'list'>('grid')

const list = ref<DocumentItem[]>([])
const total = ref(0)
const loading = ref(false)

const selectedTags = computed(() => {
  const tags: Array<{ key: keyof typeof filters.value; label: string }> = []
  if (filters.value.title) tags.push({ key: 'title', label: `题名：${filters.value.title}` })
  if (filters.value.author) tags.push({ key: 'author', label: `责任者：${filters.value.author}` })
  if (filters.value.keyword) tags.push({ key: 'keyword', label: `关键词：${filters.value.keyword}` })
  if (filters.value.type !== '全部') tags.push({ key: 'type', label: `类别：${filters.value.type}` })
  if (filters.value.region !== '全部')
    tags.push({ key: 'region', label: `区域：${filters.value.region}` })
  if (filters.value.era !== '全部') tags.push({ key: 'era', label: `年代：${filters.value.era}` })
  return tags
})

async function load() {
  loading.value = true
  const result = await fetchDocuments({ ...filters.value, page: page.value, pageSize })
  list.value = result.list
  total.value = result.total
  loading.value = false
}

function search() {
  page.value = 1
  load()
}

function reset() {
  filters.value = { title: '', author: '', keyword: '', type: '全部', region: '全部', era: '全部' }
  page.value = 1
  load()
}

function removeTag(key: keyof typeof filters.value) {
  const isText = key === 'title' || key === 'author' || key === 'keyword'
  filters.value[key] = isText ? '' : '全部'
  page.value = 1
  load()
}

function changePage(value: number) {
  page.value = value
  load()
  window.scrollTo({ top: 320, behavior: 'smooth' })
}

function switchView(mode: 'grid' | 'list') {
  viewMode.value = mode
}

function openDetail(item: DocumentItem) {
  router.push({ name: 'document-detail', params: { id: item.id } })
}

function syncFromQuery() {
  const query = route.query
  filters.value = {
    title: typeof query.title === 'string' ? query.title : '',
    author: typeof query.author === 'string' ? query.author : '',
    keyword: typeof query.keyword === 'string' ? query.keyword : '',
    type: typeof query.type === 'string' ? query.type : '全部',
    region: typeof query.region === 'string' ? query.region : '全部',
    era: typeof query.era === 'string' ? query.era : '全部'
  }
  page.value = 1
}

onMounted(() => {
  syncFromQuery()
  load()
})

watch(
  () => route.query,
  () => {
    if (route.name !== 'documents') return
    syncFromQuery()
    load()
  }
)
</script>

<template>
  <div class="documents-view">
    <PageBanner
      eyebrow="COLLECTION · 文献资源库"
      title="文献资源"
      desc="以现代文献、古籍文献、影印古籍三大类别聚合台州九县市区文旅记忆文献，支持题名、责任者与类别、区域、年代的多维组合检索。"
    />

    <div class="docs-body">
      <div class="docs-inner">
        <!-- 筛选面板 -->
        <section class="filter-panel panel">
          <div class="filter-grid">
            <label class="filter-item">
              <span class="filter-label">题名</span>
              <el-input
                v-model="filters.title"
                placeholder="输入文献题名"
                clearable
                @keyup.enter="search"
                @clear="search"
              />
            </label>

            <label class="filter-item">
              <span class="filter-label">责任者</span>
              <el-input
                v-model="filters.author"
                placeholder="输入责任者"
                clearable
                @keyup.enter="search"
                @clear="search"
              />
            </label>

            <label class="filter-item">
              <span class="filter-label">文献类别</span>
              <el-select v-model="filters.type" @change="search">
                <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </label>

            <label class="filter-item">
              <span class="filter-label">归属区域</span>
              <el-select v-model="filters.region" @change="search">
                <el-option v-for="item in regionOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </label>

            <label class="filter-item">
              <span class="filter-label">文献年代</span>
              <el-select v-model="filters.era" @change="search">
                <el-option v-for="item in eraOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </label>

            <div class="filter-actions">
              <el-button type="primary" :icon="Search" @click="search">筛选</el-button>
              <el-button :icon="Refresh" @click="reset">重置</el-button>
            </div>
          </div>

          <div v-if="selectedTags.length" class="filter-tags">
            <span class="tags-label">已选条件</span>
            <el-tag
              v-for="tag in selectedTags"
              :key="tag.key"
              closable
              type="info"
              effect="plain"
              @close="removeTag(tag.key)"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </section>

        <!-- 结果工具条 -->
        <div class="docs-toolbar">
          <p class="toolbar-count">
            共检索到 <strong>{{ total }}</strong> 条文献资源
          </p>

          <div class="view-switch">
            <button
              class="view-btn"
              :class="{ 'is-active': viewMode === 'grid' }"
              title="网格视图"
              @click="switchView('grid')"
            >
              <el-icon><Grid /></el-icon>
            </button>
            <button
              class="view-btn"
              :class="{ 'is-active': viewMode === 'list' }"
              title="列表视图"
              @click="switchView('list')"
            >
              <el-icon><List /></el-icon>
            </button>
          </div>
        </div>

        <!-- 结果列表 -->
        <div v-if="loading" class="docs-grid">
          <div v-for="index in 8" :key="index" class="skeleton-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" style="width: 100%; height: 190px" />
                <div style="padding: 18px 20px">
                  <el-skeleton-item variant="h3" style="width: 62%" />
                  <el-skeleton-item variant="text" style="margin-top: 14px" />
                  <el-skeleton-item variant="text" style="width: 82%; margin-top: 8px" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>

        <div v-else-if="list.length" class="docs-grid" :class="`is-${viewMode}`">
          <ResourceCard
            v-for="item in list"
            :key="item.id"
            :item="item"
            :mode="viewMode"
            :highlight="filters.keyword"
            @open="openDetail"
          />
        </div>

        <div v-else class="docs-empty">
          <el-empty description="没有找到符合条件的文献资源">
            <el-button type="primary" plain round :icon="ArrowRight" @click="reset">
              重新检索全部文献
            </el-button>
          </el-empty>
        </div>

        <div v-if="total > pageSize" class="docs-pager">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="page"
            @current-change="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.docs-body {
  padding: 34px 0 88px;
}

.docs-inner {
  @include page-container;
}

// ---------- 筛选面板 ----------
.filter-panel {
  padding: 22px 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
  gap: 16px 18px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.filter-label {
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--c-text-2);
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--c-line);
}

.tags-label {
  font-size: 13px;
  color: var(--c-text-3);
}

// ---------- 工具条 ----------
.docs-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 26px 0 20px;
}

.toolbar-count {
  font-size: 14px;
  color: var(--c-text-2);

  strong {
    margin: 0 2px;
    font-family: var(--font-serif);
    font-size: 18px;
    color: var(--c-primary);
  }
}

.view-switch {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--c-white);
  border: 1px solid var(--c-line);
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 32px;
  border-radius: 8px;
  color: var(--c-text-3);
  transition: all 0.24s ease;

  &:hover {
    color: var(--c-primary);
  }

  &.is-active {
    color: #fdf6e6;
    background: linear-gradient(135deg, #2a7186 0%, #17505f 100%);
  }
}

// ---------- 结果 ----------
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: 24px;

  &.is-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.skeleton-card {
  overflow: hidden;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.docs-empty {
  padding: 30px 0;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.docs-pager {
  margin-top: 38px;
}

// ---------- 响应式 ----------
@include respond-to('lg') {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .filter-actions {
      grid-column: 1 / -1;
    }
  }
}

@include respond-to('md') {
  .docs-body {
    padding: 26px 0 64px;
  }

  .docs-grid {
    gap: 16px;
  }
}

@include respond-to('xs') {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .docs-grid {
    grid-template-columns: 1fr;
  }

  .docs-toolbar {
    align-items: flex-start;
  }
}
</style>
