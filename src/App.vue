<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const scrolled = ref(false)

/** 首页 Hero 与顶栏叠放，其余页面预留固定顶栏高度 */
const padTop = computed(() => (route.name === 'home' ? '0px' : '76px'))

const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="app-shell">
    <AppHeader :scrolled="scrolled" />
    <main class="app-main" :style="{ paddingTop: padTop }">
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <el-backtop :right="36" :bottom="64" />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--c-paper);
}

.app-main {
  flex: 1;
}
</style>
