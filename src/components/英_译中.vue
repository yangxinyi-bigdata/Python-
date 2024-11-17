<template>
  <div>
    <h2>英译中</h2>
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
      this.translationStarted = true; // 设置翻译为开始状态
      // 这里应该是获取需要的数据, 将这些数据使用POST接口传递到后端Flask中, 然后获取返回值, 然后判断
      this.$http.开始翻译_英文项目({项目路径: this.projectPath, 翻译路径: this.translationPath})
      .then(() => {
          this.startPollingProgress();      // 开始轮询进度
          this.开始获取状态(); // 开始获取状态
      })
      .catch((resp) => {
        ElMessage.error("error: " + resp["message"]);
        })
    },

    stopTranslation(){
      console.log("停止翻译");
      this.$http.停止翻译_英文项目()
      .then(() => {
        clearInterval(this.状态计时器);
        this.状态信息 = "";
        clearInterval(this.progressTimer);
        this.progress = 0; // 重置进度
        this.translationStarted = false; // 重置翻译开始状态
      })
      
    }, 
    
    startPollingProgress() {
      this.progressTimer = setInterval(() => {
      this.fetchProgress();
    }, 1000);  // 每秒轮询一次
    },
    fetchProgress() {
      this.$http.获取进度()
      .then((resp) => {
        const progressData = resp.data;
        this.progress = progressData["任务进度"];
        console.log("当前进度: " + this.progress);
        if (this.progress === 'completed' || this.progress >= 100) {
          clearInterval(this.progressTimer);
          this.translationStarted = false; // 重置翻译开始状态
          ElMessage.success("翻译成功, 生成代码路径:" + this.translationPath);
          this.progress = 100;
        }
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
        clearInterval(this.progressTimer);
      });
      }, 

    开始获取状态() {
      this.状态计时器 = setInterval(() => {
      this.获取状态();
    }, 1000);  // 每秒轮询一次
    },
    
    获取状态() {
      this.$http.获取状态信息()
      .then((resp) => {
        const progressData = resp.data;
        if(progressData["状态信息"] !== this.状态信息){
          this.状态信息 = progressData["状态信息"];
          console.log("当前状态: " + this.状态信息);
        }
        
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
      });
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