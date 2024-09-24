<template>
  <div class="container">
    <div class="sidebar">
      <router-link to="/translate-to-english">
        <button>中译英</button>
      </router-link>
      <router-link to="/translate-to-chinese">
        <button>英译中</button>
      </router-link>
      <router-link to="/code-explanation">
        <button>代码解释</button>
      </router-link>
    </div>

    <div class="main">
      <!-- This is where the routed components will be displayed -->
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
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
}

.main {
  width: 80%;
  padding: 20px;
}
</style>