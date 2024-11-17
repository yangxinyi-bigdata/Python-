import { createRouter, createWebHistory } from 'vue-router';
import 中_译英 from '@/components/中_译英.vue';
import 英_译中 from '@/components/英_译中.vue';
// import 测试_中译英 from '@/components/测试_中译英.vue';
import 中译英V2 from '@/components/中译英_V2.vue';
import 英译中V2 from '@/components/英译中_V2.vue';
import CodeExplanation from '@/components/CodeExplanation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: 中_译英, // 设置为首页的默认组件
  },
  {
    path: '/translate-chinese-v2',
    name: '中译英V2',
    component: 中译英V2, 
  },
  {
    path: '/translate-english-v2',
    name: '英译中V2',
    component: 英译中V2, 
  },
  {
    path: '/translate-chinese',
    name: '中_译英',
    component: 中_译英,
  },
  {
    path: '/translate-english',
    name: '英_译中',
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