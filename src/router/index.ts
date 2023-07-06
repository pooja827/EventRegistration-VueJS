import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'eventPortal',
      component: () => import('../views/EventRegistrationPortal.vue')
    },
  ]
})

export default router
