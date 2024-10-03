<template>
  <div class="container">
    <div class="sidebar">
      <router-link to="/test-translate-chinese">
        <button>测试</button>
      </router-link>
      <router-link to="/translate-chinese">
        <button>中译英</button>
      </router-link>
      <router-link to="/translate-english">
        <button>英译中</button>
      </router-link>
      <router-link to="/code-explanation">
        <button>代码解释</button>
      </router-link>
    </div>

    <div class="main">
      <!-- 这里将显示路由组件 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  width: 20%;
  border-right: 1px solid #ccc;
  padding: 20px;
}

.sidebar button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
}

/* 当路由处于活动状态时，高亮显示按钮 */
.sidebar .router-link-exact-active button {
  background-color: #80a8b623;
  font:bolder;
}

.main {
  width: 80%;
  padding: 20px;
}
</style>