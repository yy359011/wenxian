<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ResourceSection from '@/components/home/ResourceSection.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import NewsCard from '@/components/common/NewsCard.vue'
import { fetchLatestNews, fetchNews } from '@/api'
import { newsCategories } from '@/data/news'
import type { NewsItem } from '@/types'

const router = useRouter()

const activeCategory = ref('全部')
const list = ref<NewsItem[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  if (activeCategory.value === '全部') {
    list.value = await fetchLatestNews(6)
  } else {
    const result = await fetchNews({ category: activeCategory.value, pageSize: 6 })
    list.value = result.list
  }
  loading.value = false
}

function switchCategory(value: string) {
  if (activeCategory.value === value) return
  activeCategory.value = value
  load()
}

function openDetail(item: NewsItem) {
  router.push({ name: 'news-detail', params: { id: item.id } })
}

function goNews() {
  router.push({ name: 'news' })
}

load()
</script>

<template>
  <div class="home">
    <HeroSection />

    <ResourceSection />

    <!-- 新闻资讯 -->
    <section class="news-section">
      <div class="news-inner">
        <SectionHeading
          title="新闻资讯"
          desc="政策法规 · 馆内动态 · 地方资讯"
        >
          <template #extra>
            <el-button type="primary" plain round :icon="ArrowRight" @click="goNews">
              查看全部资讯
            </el-button>
          </template>
        </SectionHeading>

        <div class="news-tabs">
          <button
            v-for="category in newsCategories"
            :key="category"
            class="news-tab"
            :class="{ 'is-active': activeCategory === category }"
            @click="switchCategory(category)"
          >
            {{ category }}
          </button>
        </div>

        <el-skeleton v-if="loading" :rows="6" animated class="news-skeleton" />

        <div v-else-if="list.length" class="news-layout">
          <div class="news-main">
            <NewsCard :item="list[0]" variant="feature" @open="openDetail" />
          </div>

          <aside class="news-side panel">
            <header class="side-head">
              <h3>最新动态</h3>
              <span>共 {{ list.length }} 条</span>
            </header>

            <NewsCard
              v-for="item in list.slice(1)"
              :key="item.id"
              :item="item"
              variant="mini"
              @open="openDetail"
            />

            <button class="side-more" @click="goNews">
              查看全部资讯
              <el-icon><ArrowRight /></el-icon>
            </button>
          </aside>
        </div>

        <el-empty v-else description="该分类下暂无资讯" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
// ---------- 新闻资讯 ----------
.news-section {
  padding: 78px 0 88px;
}

.news-inner {
  @include page-container;
}

.news-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}

.news-tab {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--c-text-2);
  background: var(--c-white);
  border: 1px solid var(--c-line);
  transition: all 0.28s ease;

  &:hover {
    color: var(--c-primary);
    border-color: rgba(29, 91, 110, 0.4);
  }

  &.is-active {
    color: #fdf6e6;
    border-color: transparent;
    background: linear-gradient(135deg, #2a7186 0%, #17505f 100%);
    box-shadow: 0 12px 24px -14px rgba(23, 80, 95, 0.9);
  }
}

.news-skeleton {
  padding: 26px;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.news-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  gap: 26px;
  align-items: start;
}

.news-side {
  padding: 8px 24px 20px;
}

.side-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--c-line);

  h3 {
    position: relative;
    padding-left: 12px;
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--c-primary-deep);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      border-radius: 2px;
      background: var(--c-gold);
    }
  }

  span {
    font-size: 12px;
    color: var(--c-text-3);
  }
}

.side-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  margin-top: 16px;
  padding: 10px 0;
  border-radius: 22px;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  transition: all 0.26s ease;

  &:hover {
    color: #fdf6e6;
    background: linear-gradient(135deg, #2a7186 0%, #17505f 100%);
  }
}

// ---------- 响应式 ----------
@include respond-to('lg') {
  .news-layout {
    grid-template-columns: 1fr;
  }
}

@include respond-to('md') {
  .news-section {
    padding: 56px 0 64px;
  }
}

@include respond-to('xs') {
  .news-tab {
    padding: 7px 14px;
    font-size: 13px;
  }

  .news-side {
    padding: 4px 16px 16px;
  }
}
</style>
