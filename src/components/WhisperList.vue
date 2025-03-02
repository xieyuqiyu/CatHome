<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const whispers = ref([])
const loading = ref(false)

// 模拟API调用
const fetchWhispers = async () => {
  loading.value = true
  try {
    // TODO: 替换为实际的API调用
    const mockData = [
      {
        id: 1,
        content: '今天天气真好，想带猫咪出去散步~',
        mood: 'happy',
        tags: ['生活'],
        likes: 12,
        timestamp: new Date()
      },
      {
        id: 2,
        content: '工作好累，但是看到猫咪就感觉充满能量！',
        mood: 'calm',
        tags: ['工作', '生活'],
        likes: 8,
        timestamp: new Date()
      },
      {
        id: 3,
        content: '猫咪今天特别粘人，好开心！',
        mood: 'happy',
        tags: ['生活', '情感'],
        likes: 15,
        timestamp: new Date()
      }
    ]
    
    // 随机打乱数组顺序
    whispers.value = mockData.sort(() => Math.random() - 0.5)
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const refreshList = () => {
  fetchWhispers()
}

onMounted(() => {
  fetchWhispers()
})

const handleLike = (whisper) => {
  // TODO: 调用后端API进行点赞
  whisper.likes++
}

const getMoodIcon = (mood) => {
  const moodIcons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    calm: '😌',
    // 点赞图标
    like: '👍'
  }
  return moodIcons[mood] || '😊'
}
</script>

<template>
  <div class="whisper-list">
    <div class="list-header">
      <h2>最新悄悄话</h2>
      <el-button type="primary" :loading="loading" @click="refreshList">
        <el-icon><Refresh /></el-icon>
        换一批
      </el-button>
    </div>
    
    <el-empty v-if="whispers.length === 0" description="还没有悄悄话，来分享第一条吧！" />
    
    <el-skeleton :loading="loading" animated :count="3" v-if="loading">
      <template #template>
        <div style="padding: 14px">
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="text" style="margin-right: 16px" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </template>
    </el-skeleton>

    <el-card style="border-radius: 10px;" v-else v-for="whisper in whispers" :key="whisper.id" class="whisper-card">
      <div class="whisper-content">
        <div class="mood-icon">{{ getMoodIcon(whisper.mood) }}</div>
        <p>{{ whisper.content }}</p>
      </div>
      
      <div class="whisper-footer">
        <div class="tags">
          <el-tag
            v-for="tag in whisper.tags"
            :key="tag"
            size="small"
            effect="light"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="actions">
            <!-- 去掉按钮的点击颜色 -->
          <el-button type="primary" text @click="handleLike(whisper)">
            {{ getMoodIcon('like') }}

            {{ whisper.likes }}
          </el-button>
          
          <span class="time">
            {{ new Date(whisper.timestamp).toLocaleString() }}
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.whisper-list {
  max-width: 600px;
  margin: 20px auto;
  width: 100%;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
  }
}

.whisper-card {
  margin-bottom: 20px;
  
  .whisper-content {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
    
    .mood-icon {
      font-size: 24px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    
    p {
      margin: 0;
      line-height: 1.6;
      word-break: break-all;
    }
  }
}

@media (max-width: 768px) {
  .whisper-list {
    margin: 10px auto;
    
    .list-header {
      margin-bottom: 15px;
      
      h2 {
        font-size: 1.1rem;
      }
    }
  }
  
  .whisper-card {
    margin-bottom: 15px;
    
    .whisper-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      
      .tags {
        margin-bottom: 8px;
        
        .el-tag {
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>