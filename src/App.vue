<script setup>
import { ref } from 'vue'
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
import WhisperList from './components/WhisperList.vue'
import WhisperForm from './components/WhisperForm.vue'

// 创建对WhisperList组件的引用
const whisperListRef = ref(null)
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h1>猫咪悄悄话</h1>
    </el-header>

    <el-main>
      <whisper-form :whisper-list-ref="whisperListRef" />
      <whisper-list ref="whisperListRef" />
    </el-main>

    <el-footer class="app-footer">
      © 2024 猫咪悄悄话 - 分享你的小秘密 | 喵喵喵
      <a href="https://beian.miit.gov.cn/" target="_blank">
        晋ICP备2021006159号-1
      </a>

      <div class="beian">

      </div>
    </el-footer>
  </el-container>
</template>

<style lang="scss">
:root {
  --primary-color: #42b883;
  --background-color: #f5f7fa;
  --text-color: #2c3e50;
}

body {
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;

  h1 {
    color: var(--primary-color);
    margin: 0;
    font-size: 1.5rem;
  }
}

.el-main {
  padding: 16px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .el-header {
    padding: 0 12px;
  }

  .el-main {
    padding: 12px;
  }
}

.app-footer {
  color: #999;
  text-align: center;
  font: 1em sans-serif;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  a {
    color: #999;
    text-decoration: none;
    font-size: 0.9em;
    &:hover {
      color: var(--primary-color);
    }
  }

  
  

  .beian {

    a {
      color: #999;
      text-decoration: none;
      font-size: 0.9em;

      &:hover {
        color: var(--primary-color);
      }
    }
  }
}
</style>
