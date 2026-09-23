import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/NewsView.vue'),
    meta: { title: '新闻资讯' }
  },
  {
    path: '/news/:id',
    name: 'news-detail',
    component: () => import('@/views/NewsDetailView.vue'),
    meta: { title: '资讯详情' }
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/DocumentsView.vue'),
    meta: { title: '文献资源' }
  },
  {
    path: '/documents/:id',
    name: 'document-detail',
    component: () => import('@/views/DocumentDetailView.vue'),
    meta: { title: '文献详情' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchResultView.vue'),
    meta: { title: '检索结果' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
})

const BASE_TITLE = '浙江图书馆浙江水系（大运河沿线）运河文献发布平台'

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== '首页' ? `${title} - ${BASE_TITLE}` : BASE_TITLE
})

export default router
