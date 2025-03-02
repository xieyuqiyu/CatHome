<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const content = ref('')
const mood = ref('happy')
const tags = ref([])

const moodOptions = [
  { label: '开心', value: 'happy', icon: '😊' },
  { label: '难过', value: 'sad', icon: '😢' },
  { label: '生气', value: 'angry', icon: '😠' },
  { label: '平静', value: 'calm', icon: '😌' }
]

const submitWhisper = () => {
  if (!content.value.trim()) {
    ElMessage.warning('请输入悄悄话内容')
    return
  }
  
  // TODO: 发送到后端API
  console.log({
    content: content.value,
    mood: mood.value,
    tags: tags.value,
    timestamp: new Date()
  })
  
  content.value = ''
  mood.value = 'happy'
  tags.value = []
  ElMessage.success('发布成功！')
}
</script>

<template>
  <div class="whisper-form">
    <el-card style="border-radius: 10px;" >
      <template #header>
        <div class="form-header">
          <span>分享你的悄悄话</span>
        </div>
      </template>
      
      <el-form>
        <el-form-item>
          <el-input
            v-model="content"
            type="textarea"
            rows="3"
            placeholder="在这里写下你的悄悄话..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="心情">
          <el-radio-group v-model="mood">
            <el-radio-button 
              v-for="option in moodOptions"
              :key="option.value"
              :label="option.value"
            >
              {{ option.icon }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select
            v-model="tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或创建标签"
          >
            <el-option label="生活" value="life" />
            <el-option label="学习" value="study" />
            <el-option label="工作" value="work" />
            <el-option label="情感" value="emotion" />
          </el-select>
        </el-form-item>
        
        <el-button type="primary" @click="submitWhisper" round>
          发布悄悄话
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.whisper-form {
  max-width: 600px;
  margin: 20px auto;
  width: 100%;  // 确保在移动端填满容器
  
  .el-form-item {
    margin-bottom: 15px;
  }
  
  .el-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .whisper-form {
    margin: 10px auto;
    
    .el-radio-button {
      margin-bottom: 8px;
    }
    
    .el-select {
      width: 100%;
    }
  }
}
</style>