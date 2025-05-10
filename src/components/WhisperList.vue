<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { get, post, API } from '../utils/request'

const whispers = ref([])
const loading = ref(false)

// 从API获取数据
const fetchWhispers = async () => {
  loading.value = true
  try {
    // 调用实际的API接口
    const response = await get(API.WHISPERS, {
      page: 1,
      limit: 10
    })

    console.log('API响应:', response.data)

    // const response = await axios.get('http://192.168.1.100:3000/api/whispers')

    // 处理返回的数据
    // 将数字mood值转换为字符串
    const moodMap = {
      0: 'happy',
      1: 'sad',
      2: 'angry',
      3: 'calm'
    }

    // 检查API返回的数据结构
    let dataArray = [];

    if (response.data) {
      if (Array.isArray(response.data)) {
        // 直接是数组格式
        dataArray = response.data;
      } else if (typeof response.data === 'object') {
        // 可能是包含data字段的对象，如 {data: [...], total: 100}
        if (Array.isArray(response.data.data)) {
          dataArray = response.data.data;
          // 如果有分页信息，可以在这里处理
          console.log('总数据条数:', response.data.total);
        } else if (Array.isArray(response.data.items)) {
          // 另一种常见的API返回格式 {items: [...], pagination: {...}}
          dataArray = response.data.items;
        } else if (Array.isArray(response.data.list)) {
          // 另一种常见的API返回格式 {list: [...], pagination: {...}}
          dataArray = response.data.list;
        }
      }
    }

    if (dataArray.length > 0) {
      // 处理返回的数据格式
      whispers.value = dataArray.map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        content: item.content,
        mood: moodMap[item.mood] || 'happy',
        tags: Array.isArray(item.tags) ? item.tags : [],
        likes: typeof item.likes === 'number' ? item.likes : parseInt(item.likes) || 0,
        timestamp: item.created_at ? new Date(item.created_at) : (item.timestamp ? new Date(item.timestamp) : new Date())
      }))
    } else {
      // 如果API暂时不可用，使用模拟数据
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
      console.warn('API返回数据格式不正确，使用模拟数据')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试',)
    // 加载失败时使用模拟数据
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

const handleLike = async (whisper) => {

  // 调用后端API进行点赞
  const response = await post(API.WHISPER_LIKE(whisper.id))
  console.log('点赞响应:', response.data)

  // 增加本地点赞数
  whisper.likes += 1

  // 随机显示点赞成功的消息内容
  const messages = [
    '大拇指很给力！',
    '少点点吧！',
    '点太快不好',
    '小心我曝光你的糗事',
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  ElMessage.success(randomMessage)
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

// 使用defineExpose暴露fetchWhispers函数，使其可以被其他组件引用
defineExpose({
  fetchWhispers
})
</script>

<template>
  <div class="whisper-list">
    <div class="list-header">
      <h2>最新悄悄话</h2>
      <el-button type="primary" :loading="loading" @click="refreshList">
        <el-icon>
          <Refresh />
        </el-icon>
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
          <el-tag v-for="tag in whisper.tags" :key="tag" size="small" effect="light">
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
          margin-right: 4px;
        }
      }
    }
  }
}
</style>