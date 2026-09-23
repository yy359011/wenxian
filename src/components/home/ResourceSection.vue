<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import ResourceCard from '@/components/common/ResourceCard.vue'
import { fetchDocumentsByType } from '@/api'
import type { DocumentItem } from '@/types'

const router = useRouter()

const typeTabs = [
  { label: '全部资源', value: '全部' },
  { label: '现代文献', value: '现代文献' },
  { label: '古籍文献', value: '古籍文献' },
  { label: '影印古籍', value: '影印古籍' }
]

const activeType = ref('全部')
const list = ref<DocumentItem[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  list.value = await fetchDocumentsByType(activeType.value, 8)
  loading.value = false
}

function switchType(value: string) {
  if (activeType.value === value) return
  activeType.value = value
  load()
}

function openDetail(item: DocumentItem) {
  router.push({ name: 'document-detail', params: { id: item.id } })
}

function goDocuments() {
  router.push({ name: 'documents' })
}

onMounted(load)
</script>

<template>
  <section class="resource-section">
    <div class="section-inner">
      <SectionHeading
        title="文献资源"
        desc="现代文献 · 古籍文献 · 影印古籍三大类别，按景点、美食、人文三大主题聚合"
      >
        <template #extra>
          <el-button type="primary" plain round :icon="ArrowRight" @click="goDocuments">
            查看全部资源
          </el-button>
        </template>
      </SectionHeading>

      <div class="type-tabs">
        <button
          v-for="tab in typeTabs"
          :key="tab.value"
          class="type-tab"
          :class="{ 'is-active': activeType === tab.value }"
          @click="switchType(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="resource-grid">
        <div v-for="index in 4" :key="index" class="skeleton-card">
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

      <div v-else-if="list.length" class="resource-grid">
        <ResourceCard v-for="item in list" :key="item.id" :item="item" @open="openDetail" />
      </div>

      <el-empty v-else description="该类别下暂无文献资源" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.resource-section {
  padding: 78px 0 10px;
}

.section-inner {
  @include page-container;
}

.type-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.type-tab {
  position: relative;
  padding: 9px 22px;
  border-radius: 22px;
  font-size: 15px;
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

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: 24px;
}

.skeleton-card {
  overflow: hidden;
  background: var(--c-white);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

// ---------- 响应式 ----------
@include respond-to('md') {
  .resource-section {
    padding-top: 56px;
  }

  .resource-grid {
    gap: 16px;
  }
}

@include respond-to('xs') {
  .resource-grid {
    grid-template-columns: 1fr;
  }

  .type-tab {
    padding: 7px 16px;
    font-size: 14px;
  }
}
</style>
