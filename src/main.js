import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router';
import http from "@/utils/http"
import './tailwind.css'  // 使用新创建的 tailwind.css 文件

const app = createApp(App);
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router);  // 使用 Vue Router
app.config.globalProperties.$http = http;
app.mount('#app');
