<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Main content -->
    <div class="flex-1 p-8">
      <h1 class="text-2xl font-semibold mb-6">英译中V2</h1>
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
            {{ translationMode === '单个py / jupyter代码' ? '文件路径' : '项目路径' }}:
          </label>
          <div class="flex">
            <input
              type="text"
              id="projectPath"
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="translationMode === '单个py / jupyter代码' ? '选择文件路径' : '选择项目路径'"
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

        <div v-if="translationMode !== '原项目中翻译'" class="mb-6">
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
              :style="{ width: `${state.progress}%` }"
            ></div>
          </div>
        </div>

        <div class="bg-gray-100 rounded-md p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">执行进程:</h3>
          <p class="text-sm text-gray-600">
            {{ state.状态信息 }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { ElMessage } from "element-plus"
import http from "@/utils/http"  // 确保这个导入是正确的

const translationMode = ref('翻译到新项目')
const projectPath = ref('')
const translationPath = ref('')
const isTranslating = ref(false)

const translationModes = ['翻译到新项目', '原项目中翻译', '单个py / jupyter代码']

const state = reactive({
  progress: 0,
  progressTimer: null,
  状态信息: "等待开始翻译...",
  状态计时器: null,
  bannerDialogVisible: false,
  translationStarted: false,
})

const selectProjectPath = async () => {
  try {
    let result;
    if (translationMode.value === translationModes[2]) {
      // For '单个py / jupyter代码', use openFile
      result = await window.myAPI.openFile()
    } else {
      // For other modes, use openDirectory
      result = await window.myAPI.openDirectory()
    }
    if (result.filePaths && result.filePaths.length > 0) {
      projectPath.value = result.filePaths[0]
    }
  } catch (error) {
    console.error('选择项目路径时出错:', error)
  }
}

const selectTranslationPath = async () => {
  try {
    const result = await window.myAPI.openDirectory()
    if (result.filePaths && result.filePaths.length > 0) {
      translationPath.value = result.filePaths[0]
    }
  } catch (error) {
    console.error('选择翻译路径时出错:', error)
  }
}

const startTranslation = () => {
  console.log("开始翻译")
  isTranslating.value = true
  state.translationStarted = true

  let method
  switch (translationMode.value) {
    case '原项目中翻译':
      method = '开始翻译_英文原项目'
      break
    case '翻译到新项目':
      method = '开始翻译_英文项目'
      break
    case '单个py / jupyter代码':
      method = '开始翻译_英文文件'
      break
    default:
      ElMessage.error("请选择有效的翻译模式")
      isTranslating.value = false
      state.translationStarted = false
      return
  }

  if (typeof http[method] !== 'function') {
    ElMessage.error(`翻译功能 "${translationMode.value}" 未实现`)
    isTranslating.value = false
    state.translationStarted = false
    return
  }

  http[method]({
    项目路径: projectPath.value,
    翻译路径: translationPath.value,
    文件路径: projectPath.value
  })
    .then(() => {
      startPollingProgress()
      开始获取状态()
    })
    .catch((error) => {
      console.error("翻译错误:", error)
      ElMessage.error(`翻译错误: ${error.message || '未知错误'}`)
      isTranslating.value = false
      state.translationStarted = false
    })
}

const stopTranslation = () => {
  console.log("停止翻译")
  isTranslating.value = false
  http.停止翻译_英文项目()
    .then(() => {
      clearInterval(state.状态计时器)
      state.状态信息 = "停止翻译"
      clearInterval(state.progressTimer)
      clearInterval(state.状态计时器)
      state.progress = 0
      state.translationStarted = false
    })
}

const startPollingProgress = () => {
  state.progressTimer = setInterval(fetchProgress, 1000)
}

const fetchProgress = () => {
  http.获取进度()
    .then((resp) => {
      const progressData = resp.data
      state.progress = progressData["任务进度"]
      console.log("当前进度: " + state.progress)
      if (state.progress === 'completed' || state.progress >= 100) {
        state.状态信息 = "翻译完成"
        console.log(state.状态信息)
        clearInterval(state.progressTimer)
        ElMessage.success("翻译成功, 生成代码路径:" + translationPath.value)
        state.progress = 100
      }
    })
    .catch((error) => {
      console.error("Error fetching progress:", error)
      clearInterval(state.progressTimer)
      clearInterval(state.状态计时器) // 在出错时也停止获取状态的定时器
    })
}

const 开始获取状态 = () => {
  state.状态计时器 = setInterval(获取状态, 1000)
}

const 获取状态 = () => {
  // 检查是否翻译完成
  if (state.状态信息 === "翻译完成") {
    clearInterval(state.状态计时器)
    isTranslating.value = false
  }
  else {
    http.获取状态信息()
      .then((resp) => {
        const progressData = resp.data
        if (progressData["状态信息"] !== state.状态信息) {
          state.状态信息 = progressData["状态信息"]
          console.log("当前状态: " + state.状态信息)
        }
      })
      .catch((error) => {
        console.error("Error fetching status:", error)
        clearInterval(state.状态计时器)
      })
  }
}

// 清理定时器
onUnmounted(() => {
  if (state.progressTimer) clearInterval(state.progressTimer)
  if (state.状态计时器) clearInterval(state.状态计时器)
})
</script>