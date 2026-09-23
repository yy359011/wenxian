<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Calendar, Printer, Share, User, View } from '@element-plus/icons-vue'
import PageBanner from '@/components/common/PageBanner.vue'
import { fetchNewsById } from '@/api'
import type { NewsItem } from '@/types'

const route = useRoute()
const router = useRouter()

const item = ref<NewsItem | null>(null)
const loading = ref(true)

async function load(id: string) {
  loading.value = true
  item.value = (await fetchNewsById(id)) ?? null
  loading.value = false
}

function goNews() {
  router.push({ name: 'news' })
}

function notify(action: string) {
  ElMessage({ message: `演示环境：已触发「${action}」`, type: 'success', duration: 1800 })
}

/** 取指定段落之后需要插入的正文插图 */
function figuresAfter(index: number) {
  return (item.value?.figures ?? []).filter((figure) => figure.after === index)
}

onMounted(() => {
  load(String(route.params.id))
})

watch(
  () => route.params.id,
  (id) => load(String(id))
)
</script>

<template>
  <div class="news-detail-view">
    <PageBanner
      eyebrow="NEWS · 资讯详情"
      title="资讯详情"
      desc="浏览资讯全文，了解平台建设动态与地方文旅资讯。"
    >
      <el-button class="banner-back" :icon="ArrowLeft" @click="goNews">返回新闻资讯</el-button>
    </PageBanner>

    <div class="detail-body">
      <div class="detail-inner">
        <el-skeleton v-if="loading" :rows="8" animated />

        <article v-else-if="item" class="detail-panel panel">
          <div class="detail-head">
            <h1 class="detail-title">{{ item.title }}</h1>
            <ul class="detail-meta">
              <li><el-icon><Calendar /></el-icon>{{ item.publishDate }}</li>
              <li>{{ item.source }}</li>
              <li><el-icon><User /></el-icon>{{ item.author }}</li>
              <li><el-icon><View /></el-icon>{{ item.views.toLocaleString() }} 次阅读</li>
            </ul>
          </div>

          <div class="detail-content">
            <template v-for="(paragraph, index) in item.content" :key="index">
              <p>{{ paragraph }}</p>
              <figure
                v-for="(figure, figureIndex) in figuresAfter(index)"
                :key="figureIndex"
                class="detail-figure"
              >
                <img :src="figure.src" :alt="figure.caption" loading="lazy" />
                <figcaption>{{ figure.caption }}</figcaption>
              </figure>
            </template>
          </div>

          <div class="detail-actions">
            <el-button :icon="Share" @click="notify('分享资讯')">分享</el-button>
            <el-button :icon="Printer" @click="notify('打印资讯')">打印</el-button>
          </div>

          <div class="detail-foot">
            <p>供稿单位：{{ item.source }}</p>
            <p>责任编辑：{{ item.author }}</p>
            <p>平台声明：本站资讯仅用于文旅记忆展示与研究，转载请注明来源。</p>
          </div>
        </article>

        <el-empty v-else description="未找到该资讯">
          <el-button type="primary" plain round @click="goNews">返回新闻资讯列表</el-button>
        </el-empty>
      </div>
    </div>
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

.detail-panel {
  max-width: 980px;
  margin: 0 auto;
  padding: 30px 38px 34px;
}

.detail-title {
  margin-top: 0;
  font-family: var(--font-serif);
  font-size: 29px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.03em;
  text-align: center;
  color: var(--c-primary-deep);
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  margin-top: 14px;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--c-line);
  font-size: 13px;
  color: var(--c-text-3);

  li {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.detail-content {
  margin-top: 24px;

  p {
    margin-bottom: 16px;
    font-size: 15px;
    line-height: 2.1;
    color: var(--c-text);
    text-indent: 2em;
  }
}

// 正文插图：图文结合
.detail-figure {
  margin: 6px 0 24px;

  img {
    display: block;
    width: 100%;
    border-radius: var(--radius-md);
    background: linear-gradient(140deg, #dfe7e8, #c9d6d9);
  }

  figcaption {
    margin-top: 10px;
    font-size: 12px;
    line-height: 1.8;
    letter-spacing: 0.04em;
    text-align: center;
    color: var(--c-text-3);
  }
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.detail-foot {
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px dashed var(--c-line);
  font-size: 12px;
  line-height: 2;
  color: var(--c-text-3);
}

// ---------- 响应式 ----------
@include respond-to('md') {
  .detail-panel {
    padding: 24px 24px 26px;
  }

  .detail-title {
    font-size: 24px;
  }
}

@include respond-to('xs') {
  .detail-body {
    padding: 26px 0 56px;
  }

  .detail-title {
    font-size: 21px;
  }
}
</style>
