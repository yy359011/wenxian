<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
import PageBanner from '@/components/common/PageBanner.vue'
import NewsCard from '@/components/common/NewsCard.vue'
import { fetchNews } from '@/api'
import { newsCategories } from '@/data/news'
import type { NewsItem } from '@/types'

const route = useRoute()
const router = useRouter()

const category = ref('全部')
const keyword = ref('')
const page = ref(1)
const pageSize = 6

const list = ref<NewsItem[]>([])
const total = ref(0)
const loading = ref(false)

async function load() {
  loading.value = true
  const result = await fetchNews({
    keyword: keyword.value,
    category: category.value,
    page: page.value,
    pageSize
  })
  list.value = result.list
  total.value = result.total
  loading.value = false
}

function syncFromQuery() {
  const query = route.query
  keyword.value = typeof query.keyword === 'string' ? query.keyword : ''
  category.value = typeof query.category === 'string' ? query.category : '全部'
  page.value = 1
}

function reset() {
  keyword.value = ''
  category.value = '全部'
  page.value = 1
  load()
}

function switchCategory(value: string) {
  if (category.value === value) return
  category.value = value
  page.value = 1
  load()
}

function changePage(value: number) {
  page.value = value
  load()
  window.scrollTo({ top: 240, behavior: 'smooth' })
}

function openDetail(item: NewsItem) {
  router.push({ name: 'news-detail', params: { id: item.id } })
}

onMounted(() => {
  syncFromQuery()
  load()
})

watch(
  () => route.query,
  () => {
    if (route.name !== 'news') return
    syncFromQuery()
    load()
  }
)
</script>

<template>
  <div class="news-view">
    <PageBanner
      eyebrow="NEWS · 资讯动态"
      title="新闻资讯"
      desc="汇聚平台建设动态、地方文旅资讯与文献征集公告，记录山海台州文献数字化工作的每一步进展。"
    />

    <div class="news-body">
      <div class="news-inner">
        <div class="news-main">
          <div class="news-toolbar">
            <div class="news-tabs">
              <button
                v-for="item in newsCategories"
                :key="item"
                class="news-tab"
                :class="{ 'is-active': category === item }"
                @click="switchCategory(item)"
              >
                {{ item }}
              </button>
            </div>

            <div class="toolbar-right">
              <span class="result-count">
                共 <strong>{{ total }}</strong> 条
                <template v-if="keyword">（关键词：{{ keyword }}）</template>
              </span>
              <el-button :icon="Refresh" text @click="reset">重置</el-button>
            </div>
          </div>

          <div v-if="loading" class="news-list">
            <el-skeleton v-for="index in 3" :key="index" animated class="list-skeleton">
              <template #template>
                <div class="skeleton-row">
                  <el-skeleton-item variant="image" style="width: 168px; height: 112px" />
                  <div class="skeleton-text">
                    <el-skeleton-item variant="h3" style="width: 60%" />
                    <el-skeleton-item variant="text" style="margin-top: 14px" />
                    <el-skeleton-item variant="text" style="width: 78%; margin-top: 8px" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>

          <div v-else-if="list.length" class="news-list">
            <NewsCard
              v-for="item in list"
              :key="item.id"
              :item="item"
              variant="item"
              @open="openDetail"
            />
          </div>

          <el-empty v-else description="没有找到符合条件的资讯，试试更换关键词或分类" />

          <div v-if="total > pageSize" class="news-pager">
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
  </div>
</template>

<style scoped lang="scss">
.news-body {
  padding: 44px 0 88px;
}

.news-inner {
  @include page-container;
}

// ---------- 主列表 ----------
.news-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--c-line);
}

.news-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.news-tab {
  padding: 7px 18px;
  border-radius: 18px;
  font-size: 14px;
  color: var(--c-text-2);
  background: var(--c-white);
  border: 1px solid var(--c-line);
  transition: all 0.26s ease;

  &:hover {
    color: var(--c-primary);
    border-color: rgba(29, 91, 110, 0.4);
  }

  &.is-active {
    color: #fdf6e6;
    border-color: transparent;
    background: linear-gradient(135deg, #2a7186 0%, #17505f 100%);
    box-shadow: 0 10px 22px -14px rgba(23, 80, 95, 0.9);
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--c-text-3);

  strong {
    color: var(--c-primary);
  }
}

.news-list {
  padding: 6px 0 0;
}

.list-skeleton {
  padding: 16px 0;
  border-bottom: 1px dashed var(--c-line);
}

.skeleton-row {
  display: flex;
  gap: 18px;
}

.skeleton-text {
  flex: 1;
}

.news-pager {
  margin-top: 34px;
}

// ---------- 响应式 ----------
@include respond-to('md') {
  .news-body {
    padding: 32px 0 64px;
  }

  .news-toolbar {
    align-items: flex-start;
  }
}

@include respond-to('xs') {
  .news-tab {
    padding: 6px 14px;
    font-size: 13px;
  }
}
</style>
