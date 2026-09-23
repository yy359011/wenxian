<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Search, Close } from '@element-plus/icons-vue'

const props = defineProps<{ scrolled: boolean }>()

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '首页', path: '/' },
  { label: '新闻资讯', path: '/news' },
  { label: '文献资源', path: '/documents' }
]

const isHome = computed(() => route.name === 'home')
/** 首页顶部时顶栏透明叠放于 Hero 之上 */
const transparent = computed(() => isHome.value && !props.scrolled)

const keyword = ref('')
const mobileOpen = ref(false)

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

function handleSearch() {
  const value = keyword.value.trim()
  router.push({ name: 'documents', query: value ? { keyword: value } : {} })
  mobileOpen.value = false
}

function go(path: string) {
  mobileOpen.value = false
  router.push(path)
}
</script>

<template>
  <header class="site-header" :class="{ 'is-transparent': transparent, 'is-scrolled': scrolled }">
    <div class="header-inner">
      <RouterLink to="/" class="logo" aria-label="返回首页">
        <span class="logo-mark">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <!-- 展开的文献：左右双页 + 书脊 -->
            <path
              d="M6.6 10.6 L22.4 14.6 V24.8 L6.6 20.8 Z"
              fill="currentColor"
              fill-opacity="0.16"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linejoin="round"
            />
            <path
              d="M41.4 10.6 L25.6 14.6 V24.8 L41.4 20.8 Z"
              fill="currentColor"
              fill-opacity="0.16"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linejoin="round"
            />
            <path
              d="M24 14.4 V24.9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              opacity="0.85"
            />
            <!-- 运河水纹：两道同频波浪，示意浙江水系干流 -->
            <path
              d="M4 31.5 q5 -3.2 10 0 t10 0 t10 0 t10 0"
              fill="none"
              stroke="#7fc4d4"
              stroke-width="2.6"
              stroke-linecap="round"
            />
            <path
              d="M4 37.5 q5 -3.2 10 0 t10 0 t10 0 t10 0"
              fill="none"
              stroke="#7fc4d4"
              stroke-width="2.4"
              stroke-linecap="round"
              opacity="0.55"
            />
          </svg>
        </span>
        <span class="logo-text">
          <strong class="logo-title">浙江图书馆</strong>
          <em class="logo-sub">浙江水系（大运河沿线）运河文献发布平台</em>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'is-active': isActive(item.path) }"
        >
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button class="menu-trigger" aria-label="打开导航菜单" @click="mobileOpen = true">
          <i></i><i></i><i></i>
        </button>
      </div>
    </div>

    <el-drawer
      v-model="mobileOpen"
      direction="rtl"
      size="320px"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="drawer-head">
        <span class="drawer-title">浙江图书馆</span>
        <el-icon class="drawer-close" @click="mobileOpen = false"><Close /></el-icon>
      </div>
      <el-input
        v-model="keyword"
        placeholder="检索文献 / 影像 / 口述史"
        :prefix-icon="Search"
        class="drawer-search"
        @keyup.enter="handleSearch"
      />
      <ul class="drawer-nav">
        <li
          v-for="item in navItems"
          :key="item.path"
          :class="{ 'is-active': isActive(item.path) }"
          @click="go(item.path)"
        >
          <span>{{ item.label }}</span>
        </li>
      </ul>
      <div class="drawer-foot">
        <p>咨询服务：0576-8888 8888</p>
        <p>开放时间：周二至周日 09:00 - 17:00</p>
      </div>
    </el-drawer>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: var(--z-header);
  height: 76px;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 0.36s ease, border-color 0.36s ease, box-shadow 0.36s ease,
    color 0.36s ease;
  color: var(--c-text);

  // 滚动后补上底色与分隔线，避免页面内容从顶栏下穿过
  &.is-scrolled {
    background: rgba(255, 255, 255, 0.94);
    border-bottom-color: var(--c-line);
    backdrop-filter: blur(14px);
  }

  &.is-transparent {
    background: transparent;
    border-bottom-color: transparent;
    color: var(--c-text-invert);
    box-shadow: none;
    backdrop-filter: none;

    .logo-sub {
      color: rgba(243, 239, 230, 0.72);
    }

    // 透明态下深青色选中色在深色 Hero 上辨识度不足，改为白色
    .nav-item.is-active .nav-label {
      color: #ffffff;
    }

    .nav-item.is-active .nav-label::after,
    .nav-item:hover .nav-label::after {
      background: var(--c-gold-light);
    }

    .menu-trigger i {
      background: var(--c-text-invert);
    }
  }
}

.header-inner {
  @include page-container;

  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: var(--c-gold-light);
  // 加深底色，让金色文献与青色水纹同时清晰
  background: linear-gradient(150deg, #1f5a6c 0%, #0b2530 100%);
  box-shadow: inset 0 0 0 1px rgba(216, 184, 120, 0.32),
    0 10px 20px -12px rgba(9, 31, 42, 0.9);

  svg {
    width: 30px;
    height: 30px;
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.logo-sub {
  margin-top: 2px;
  font-size: 11px;
  font-style: normal;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.nav-item {
  position: relative;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  transition: background 0.28s ease, color 0.28s ease;

  &:hover {
    background: rgba(29, 91, 110, 0.07);
  }
}

.nav-label {
  position: relative;
  display: inline-block;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.06em;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: var(--c-primary);
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
}

.nav-item.is-active .nav-label {
  color: var(--c-primary);

  &::after {
    width: 26px;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.menu-trigger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0 9px;
  border-radius: var(--radius-sm);

  i {
    display: block;
    height: 2px;
    border-radius: 2px;
    background: var(--c-text);

    &:last-child {
      width: 62%;
    }
  }
}

// ---------- 抽屉 ----------
.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--c-line);
}

.drawer-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--c-primary-deep);
}

.drawer-close {
  font-size: 20px;
  color: var(--c-text-3);
  cursor: pointer;

  &:hover {
    color: var(--c-primary);
  }
}

.drawer-search {
  margin: 18px 0 8px;
}

.drawer-nav {
  li {
    padding: 14px 4px;
    border-bottom: 1px dashed var(--c-line);
    cursor: pointer;

    span {
      font-size: 16px;
      color: var(--c-text);
    }

    &.is-active span {
      color: var(--c-primary);
      font-weight: 600;
    }
  }
}

.drawer-foot {
  margin-top: 26px;
  font-size: 12px;
  line-height: 1.9;
  color: var(--c-text-3);
}

// ---------- 响应式 ----------
@include respond-to('xl') {
  .header-inner {
    gap: 20px;
  }

  .nav-item {
    padding: 8px 12px;
  }
}

@include respond-to('lg') {
  .nav-label {
    font-size: 16px;
  }
}

@include respond-to('sm') {
  .nav {
    display: none;
  }

  .menu-trigger {
    display: flex;
    margin-left: auto;
  }
}

@include respond-to('xs') {
  .logo-sub {
    display: none;
  }
}
</style>
