<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-20 bg-white shadow-md">
      <div class="flex flex-col items-center py-4">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="[
            'p-3 rounded-lg mb-4',
            activeTab === tab.name ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          ]"
          @click="setActiveTab(tab.name)"
        >
          <component :is="tab.icon" class="w-6 h-6" :class="{ 'transform rotate-180': tab.name === '英译中' }" />
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 p-8">
      <h1 class="text-2xl font-semibold mb-6">{{ activeTab }}</h1>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-medium mb-4">翻译模式:</h2>
        <div class="flex space-x-4 mb-6">
          <label v-for="mode in translationModes" :key="mode" class="flex items-center">
            <input
              type="radio"
              class="form-radio text-blue-600"
              name="translationMode"
              :value="mode"
              v-model="translationMode"
            />
            <span class="ml-2">{{ mode }}</span>
          </label>
        </div>

        <div class="mb-4">
          <label for="projectPath" class="block text-sm font-medium text-gray-700 mb-1">
            项目路径:
          </label>
          <div class="flex">
            <input
              type="text"
              id="projectPath"
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="选择项目路径"
              v-model="projectPath"
            />
            <button
              class="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="selectProjectPath"
            >
              选择
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label for="translationPath" class="block text-sm font-medium text-gray-700 mb-1">
            翻译路径:
          </label>
          <div class="flex">
            <input
              type="text"
              id="translationPath"
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="选择翻译路径"
              v-model="translationPath"
            />
            <button
              class="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="selectTranslationPath"
            >
              选择
            </button>
          </div>
        </div>

        <div class="flex space-x-4 mb-6">
          <button
            class="px-4 py-2 rounded-md text-white"
            :class="isTranslating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
            @click="startTranslation"
            :disabled="isTranslating"
          >
            开始翻译
          </button>
          <button
            class="px-4 py-2 rounded-md text-white"
            :class="!isTranslating ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'"
            @click="stopTranslation"
            :disabled="!isTranslating"
          >
            停止翻译
          </button>
        </div>

        <div v-if="isTranslating" class="mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <div class="bg-gray-100 rounded-md p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">执行进程:</h3>
          <p class="text-sm text-gray-600">
            {{ isTranslating ? '正在翻译...' : '等待开始翻译' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CodeBracketIcon, LanguageIcon } from '@heroicons/vue/24/outline'

const activeTab = ref('中译英')
const translationMode = ref('直接在原项目中')
const projectPath = ref('')
const translationPath = ref('')
const isTranslating = ref(false)
const progress = ref(0)

const tabs = [
  { name: '中译英', icon: LanguageIcon },
  { name: '英译中', icon: LanguageIcon },
  { name: '代码解释', icon: CodeBracketIcon },
]

const translationModes = ['直接在原项目中', '新项目', '单个Py代码']

const setActiveTab = (tabName) => {
  activeTab.value = tabName
}

const startTranslation = () => {
  isTranslating.value = true
  progress.value = 0
  // 模拟翻译进度
  const interval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(interval)
      isTranslating.value = false
    }
  }, 500)
}

const stopTranslation = () => {
  isTranslating.value = false
  progress.value = 0
}

const selectProjectPath = () => {
  // 实现选择项目路径的逻辑
  console.log('选择项目路径')
}

const selectTranslationPath = () => {
  // 实现选择翻译路径的逻辑
  console.log('选择翻译路径')
}

</script>

