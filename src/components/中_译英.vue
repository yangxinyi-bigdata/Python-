<template>
  <div>
    <h2>中译英</h2>
    <div class="translation-mode">
      <label>翻译模式:</label>
      <div class="options">
        <label><input type="checkbox" v-model="translateMode.origin" /> 直接在原项目中</label>
        <label><input type="checkbox" v-model="translateMode.newProject" /> 新项目</label>
        <label><input type="checkbox" v-model="translateMode.singleFile" /> 单个Py代码</label>
      </div>
    </div>

    <div class="path-selection">
      <label>项目路径:</label>
      <input type="text" v-model="projectPath" placeholder="选择项目路径" class="wide-input"  />
      <!-- <button @click="selectProjectPath">点击选择</button> -->
    </div>

    <div class="path-selection">
      <label>翻译路径:</label>
      <input type="text" v-model="translationPath" placeholder="选择翻译路径" class="wide-input" />
      <!-- <button @click="selectTranslationPath">点击选择</button> -->
    </div>

    <div class="actions">
      <button class="wide-button" @click="startTranslation" :disabled="translationStarted && progress < 100">开始翻译</button>
      <progress :value="progress" max="100">{{ progress }}%</progress>
    </div>

    <div class="actions">
      <button class="wide-button" @click="stopTranslation" :disabled="!translationStarted || progress >= 100">停止翻译</button>
    </div>
  </div>

  <div style="max-width: 600px; padding-top:18px"  >
    <el-alert :title="'执行进程: ' + 状态信息" type="success" />
  </div>

</template>

<script>
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      translateMode: {
        origin: false,
        newProject: false,
        singleFile: false,
      },
      projectPath: "",
      translationPath: "",
      progress: 0,
      progressTimer: null,
      状态信息: "", 
      状态计时器: null,
      bannerDialogVisible: false, 
      translationStarted: false, // 追踪翻译是否已开始
    };
  },
  methods: {
    selectProjectPath() {
      console.log("选择项目路径");
    },
    selectTranslationPath() {
      console.log("选择翻译路径");
    },
    startTranslation() {
      console.log("开始翻译");
      // 这里应该是获取需要的数据, 将这些数据使用POST接口传递到后端Flask中, 然后获取返回值, 然后判断
      this.$http.开始翻译_中文项目({项目路径: this.projectPath, 翻译路径: this.translationPath})
      .then((resp) => {
        ElMessage.success("翻译成功, 生成代码路径:" + resp["message"]);
      })
      .catch((resp) => {
        ElMessage.error("error: " + resp["message"]);
        })
    }
  },
};


</script>

<style scoped>
.options {
  display: flex;
  gap: 10px;
}

.path-selection {
  margin-bottom: 20px;
  width: 100%;
  display: flex; /* 添加 Flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 元素间距 */
}

.path-selection label {
  width: 100px; /* 为标签设置固定宽度，确保对齐 */
}

.wide-input {
  flex: 1; /* 让输入框占据剩余空间 */
  padding: 8px;
  font-size: 16px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
}

.wide-button {
  width: 120px;  /* 或使用更宽的值，根据需要调整 */
  padding: 8px 16px;
  /* font-size: 12px; */
}

progress {
  width: 80%;
  height: 20px;
}

.translation-mode {
  padding-bottom: 18px;
}

.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>