import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/layouts/auth.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      meta: { title: 'Not found page' },
      component: () => import('@/layouts/error.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let isAuthenticated = localStorage.getItem('user')
  if (isAuthenticated !== null) {
    isAuthenticated = JSON.parse(isAuthenticated).name
  }

  if (to.name !== 'auth' && !isAuthenticated) next({ name: 'auth' })
  else next()
})
export default router
