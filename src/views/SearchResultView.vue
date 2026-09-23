<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import PageBanner from '@/components/common/PageBanner.vue'
import ResourceCard from '@/components/common/ResourceCard.vue'
import NewsCard from '@/components/common/NewsCard.vue'
import { fetchDocuments, fetchNews } from '@/api'
import type { DocumentItem, NewsItem } from '@/types'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const page = ref(1)
const pageSize = 8

const list = ref<DocumentItem[]>([])
const total = ref(0)
const newsList = ref<NewsItem[]>([])
const loading = ref(false)

/** 是否已输入有效检索条件（关键词） */
const hasCondition = computed(() => !!keyword.value.trim())

async function load() {
  // 无条件时不返回全量结果，直接展示暂无内容
  if (!hasCondition.value) {
    list.value = []
    total.value = 0
    newsList.value = []
    loading.value = false
    return
  }

  loading.value = true
  const key = keyword.value.trim()
  const [docs, news] = await Promise.all([
    fetchDocuments({
      keyword: key,
      page: page.value,
      pageSize
    }),
    fetchNews({ keyword: key, pageSize: 6 })
  ])
  list.value = docs.list
  total.value = docs.total
  newsList.value = news.list
  loading.value = false
}

function syncFromQuery() {
  const query = route.query
  keyword.value = typeof query.keyword === 'string' ? query.keyword : ''
  page.value = 1
}

function submit() {
  const text = keyword.value.trim()
  router.push({
    name: 'search',
    query: text ? { keyword: text } : {}
  })
}

function reset() {
  keyword.value = ''
  submit()
}

function changePage(value: number) {
  page.value = value
  load()
  window.scrollTo({ top: 320, behavior: 'smooth' })
}

function openDetail(item: DocumentItem) {
  router.push({ name: 'document-detail', params: { id: item.id } })
}

function openNews(item: NewsItem) {
  router.push({ name: 'news-detail', params: { id: item.id } })
}

onMounted(() => {
  syncFromQuery()
  load()
})

watch(
  () => route.query,
  () => {
    if (route.name !== 'search') return
    syncFromQuery()
    load()
  }
)
</script>

<template>
  <div class="search-view">
    <PageBanner
      eyebrow="SEARCH · 全文检索"
      title="检索结果"
      desc="检索范围覆盖文献资源与新闻资讯，基于题名、责任者、主题、区域、年代与收藏单位，命中关键词已在结果中高亮显示。"
    />

    <div class="search-body">
      <div class="search-inner">
        <!-- 检索条件 -->
        <section class="refine-bar panel">
          <el-input
            v-model="keyword"
            class="refine-input"
            placeholder="输入文献题名、责任者、关键词，如「台州府志」"
            clearable
            @keyup.enter="submit"
          />

          <el-button type="primary" :icon="Search" @click="submit">检索</el-button>
          <el-button :icon="Refresh" @click="reset">重置</el-button>
        </section>

        <!-- 文献资源结果 -->
        <section class="docs-block">
          <div class="block-head">
            <h3 class="block-title">文献资源</h3>
            <span v-if="hasCondition && !loading" class="block-count">共 {{ total }} 条</span>
            <span v-else-if="!hasCondition" class="block-count">
              输入关键词后开始检索
            </span>
          </div>

          <div v-if="loading" class="result-list">
            <div v-for="index in 4" :key="index" class="skeleton-card">
              <el-skeleton animated>
                <template #template>
                  <div class="skeleton-row">
                    <el-skeleton-item variant="image" style="width: 260px; height: 178px" />
                    <div class="skeleton-body">
                      <el-skeleton-item variant="h3" style="width: 46%" />
                      <el-skeleton-item variant="text" style="margin-top: 14px" />
                      <el-skeleton-item variant="text" style="width: 82%; margin-top: 8px" />
                    </div>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>

          <div v-else-if="list.length" class="result-list">
            <ResourceCard
              v-for="item in list"
              :key="item.id"
              :item="item"
              mode="list"
              :highlight="keyword"
              @open="openDetail"
            />
          </div>

          <div v-else-if="hasCondition && newsList.length" class="result-hint">
            未找到匹配的文献资源，以下为相关资讯
          </div>

          <div v-else-if="hasCondition" class="result-empty">
            <el-empty description="没有找到符合条件的文献资源">
              <el-button type="primary" plain round :icon="Refresh" @click="reset">
                重置检索条件
              </el-button>
            </el-empty>
          </div>

          <div v-else class="result-empty">
            <el-empty description="暂无内容" />
          </div>

          <div v-if="total > pageSize" class="result-pager">
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :total="total"
              :page-size="pageSize"
              :current-page="page"
              @current-change="changePage"
            />
          </div>
        </section>

        <!-- 相关资讯 -->
        <section v-if="newsList.length" class="news-block">
          <div class="block-head">
            <h3 class="block-title">相关资讯</h3>
            <span class="block-count">共 {{ newsList.length }} 条</span>
          </div>
          <div class="news-panel panel">
            <NewsCard
              v-for="item in newsList"
              :key="item.id"
              :item="item"
              :highlight="keyword"
              @open="openNews"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-body {
  padding: 34px 0 88px;
}

.search-inner {
  @include page-container;
}

// ---------- 检索条件 ----------
.refine-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
}

.refine-input {
  flex: 1;
  min-width: 0;
}

// ---------- 文献资源结果 ----------
.docs-block {
  margin-top: 26px;
}

// ---------- 结果列表 ----------
.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  overflow: hidden;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.skeleton-row {
  display: flex;
  gap: 20px;
  padding: 14px;
}

.skeleton-body {
  flex: 1;
  min-width: 0;
  padding-top: 6px;
}

.result-empty {
  padding: 30px 0;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.result-hint {
  padding: 16px 22px;
  font-size: 14px;
  color: var(--c-text-3);
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.result-pager {
  margin-top: 38px;
}

// ---------- 相关资讯 ----------
.news-block {
  margin-top: 46px;
}

.block-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}

.block-title {
  position: relative;
  padding-left: 14px;
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--c-text);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: var(--c-gold);
    transform: translateY(-50%);
  }
}

.block-count {
  font-size: 13px;
  color: var(--c-text-3);
}

.news-panel {
  padding: 8px 24px;
}

// ---------- 响应式 ----------
@include respond-to('md') {
  .search-body {
    padding: 26px 0 64px;
  }

  .refine-bar {
    padding: 14px;
  }

  .skeleton-row {
    flex-direction: column;
    gap: 12px;
  }
}

@include respond-to('xs') {
  .refine-bar {
    flex-wrap: wrap;
    gap: 10px;
  }

  .refine-input {
    flex: 1 1 100%;
  }

  .news-block {
    margin-top: 34px;
  }

  .block-title {
    font-size: 18px;
  }

  .news-panel {
    padding: 6px 14px;
  }
}
</style>
