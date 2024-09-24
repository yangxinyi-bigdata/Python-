import { createRouter, createWebHistory } from 'vue-router';
import 中_译英 from '@/components/中_译英.vue';
import 英_译中 from '@/components/英_译中.vue';
import CodeExplanation from '@/components/CodeExplanation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: 中_译英, // 设置为首页的默认组件
  },
  {
    path: '/translate-to-english',
    name: 'TranslateToEnglish',
    component: 中_译英,
  },
  {
    path: '/translate-to-chinese',
    name: 'TranslateToChinese',
    component: 英_译中,
  },
  {
    path: '/code-explanation',
    name: 'CodeExplanation',
    component: CodeExplanation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;