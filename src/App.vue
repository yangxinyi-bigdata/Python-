<template>
  <div class="flex">
    <div class="w-1/5 border-r border-gray-200 p-4 space-y-4">
      <router-link 
        v-for="(route, index) in routes" 
        :key="index"
        :to="route.path" 
        custom 
        v-slot="{ navigate, isActive }"
      >
        <button 
          @click="navigate" 
          :class="[
            'w-full py-2 px-4 rounded-lg transition-colors duration-200',
            isActive 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ route.name }}
        </button>
      </router-link>
    </div>

    <div class="w-4/5 p-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      routes: [
        { path: '/translate-chinese-v2', name: '中译英V2' },
        { path: '/translate-english-v2', name: '英译中V2' },
        { path: '/translate-chinese', name: '中译英' },
        { path: '/translate-english', name: '英译中' },
        { path: '/code-explanation', name: '代码解释' },
      ]
    }
  }
};
</script>