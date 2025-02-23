import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@index/pages/Home/index.vue') },
    { path: '/about', component: () => import('@index/pages/About/index.vue') },
  ],
});

export default router;
