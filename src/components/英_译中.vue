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
        <input type="text" v-model="projectPath" placeholder="选择项目路径" />
        <button @click="selectProjectPath">点击选择</button>
      </div>
  
      <div class="path-selection">
        <label>翻译路径:</label>
        <input type="text" v-model="translationPath" placeholder="选择翻译路径" />
        <button @click="selectTranslationPath">点击选择</button>
      </div>
  
      <div class="actions">
        <button @click="startTranslation">开始翻译</button>
        <progress :value="progress" max="100">{{ progress }}%</progress>
      </div>
    </div>
  </template>
  
  <script>
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
        this.progress = 50;
      },
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
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  progress {
    width: 100%;
    height: 20px;
  }
  </style>