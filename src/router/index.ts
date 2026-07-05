import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { t } from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { titleKey: 'app.title' }
  },
  {
    path: '/play/:size',
    name: 'play',
    component: () => import('@/views/Play.vue'),
    meta: { titleKey: 'home.modes' },
    props: true
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/History.vue'),
    meta: { titleKey: 'history.title' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: { titleKey: 'settings.title' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { titleKey: 'about.title' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  const key = to.meta?.titleKey as string | undefined
  const appName = t('app.title')
  const pageTitle = key ? t(key) : appName
  document.title = key ? `${pageTitle} · ${appName}` : appName
})

