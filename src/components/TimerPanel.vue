<template>
  <div
    class="timer-panel"
    :class="{ vip: item.isVip === '会员', finished: item.isFinish, paused: isPaused }"
  >
    <div class="timer-header">
      <span class="user-name">{{ item.name }}</span>
      <span class="user-type">{{ item.isVip }}</span>
      <span
        class="timer-type"
        :class="{ countdown: item.type === '倒计时', countup: item.type === '正计时' }"
        >{{ item.type }}
        <span class="timer-duration" v-if="item.type === '倒计时'">{{ item.duration }}小时</span>
      </span>
    </div>
    <div class="timer-content">
      <div v-if="item.type === '倒计时'" class="countdown">
        <div class="time-display">
          <!-- 倒计时显示 -->
          <template v-if="!item.isFinish">
            <span class="time" :class="{ paused: isPaused }">{{ formatTime(remainingTime) }}</span>
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </template>
          <!-- 已完成显示 -->
          <template v-else>
            <span class="time finished">已完成</span>
            <span class="time-info"> {{ item.duration }}小时计时</span>
          </template>
        </div>
      </div>
      <!-- 正计时显示 -->
      <div v-else class="countup">
        <div class="time-display" v-if="!item.isFinish">
          <span class="time" :class="{ paused: isPaused }">{{ formatTime(elapsedTime) }}</span>
        </div>
        <div class="time-info" v-else>
          <span class="time finished">已结束</span>
          <span class="time-info-text"
            >共计:{{ formatTimeInfo(Math.round(item.duration * 3600)) }}</span
          >
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="timer-controls" v-if="!item.isFinish">
      <!-- 暂停/继续按钮 -->
      <el-button size="small" :type="isPaused ? 'primary' : 'default'" @click="togglePause">
        {{ isPaused ? '继续' : '暂停' }}
      </el-button>

      <!-- 增加时间按钮 (仅倒计时) -->
      <el-button-group v-if="item.type === '倒计时'">
        <el-button size="small" @click="addTime(0.5)">+30分钟</el-button>
        <el-button size="small" @click="addTime(1)">+1小时</el-button>
      </el-button-group>

      <!-- 结束按钮 -->
      <el-button size="small" type="danger" @click="finishTimer">结束</el-button>
    </div>

    <!-- 已完成计时器的控制按钮 -->
    <div class="timer-controls" v-else>
      <!-- 删除按钮 -->
      <el-button size="small" type="danger" class="delete-button" @click="deleteTimer"
        >删除</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import type { TimerItem } from '@/services/storageService'
import { storageService } from '@/services/storageService'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
  item: TimerItem
}>()

// 获取共享的计时器列表
const emit = defineEmits(['timer-updated', 'delete-timer'])

// 状态
const remainingTime = ref(0) // 剩余时间（秒）
const elapsedTime = ref(0) // 已过时间（秒）
const timerInterval = ref<number | null>(null)
const isPaused = ref(false) // 是否暂停
const pausedTime = ref<number | null>(null) // 暂停时的时间戳

// 计算倒计时进度百分比
const progressPercent = computed(() => {
  if (props.item.type === '倒计时') {
    const totalSeconds = props.item.duration * 60 * 60
    return (remainingTime.value / totalSeconds) * 100
  }
  return 0
})

// 格式化时间
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatTimeInfo = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  // 更人性化地显示时间
  let result = ''
  if (hours > 0) {
    result += `${hours}小时`
  }
  if (minutes > 0 || hours === 0) {
    result += `${minutes}分钟`
  }
  if ((secs > 0 && hours === 0) || (hours === 0 && minutes === 0)) {
    result += `${secs}秒`
  }
  return result
}

// 暂停/继续计时
const togglePause = () => {
  isPaused.value = !isPaused.value

  if (isPaused.value) {
    // 暂停计时
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
      pausedTime.value = Date.now()
    }
  } else {
    // 继续计时
    if (props.item.type === '倒计时') {
      // 继续倒计时
      timerInterval.value = window.setInterval(() => {
        remainingTime.value--

        // 时间到
        if (remainingTime.value <= 0) {
          props.item.isFinish = true
          // 通知父组件更新状态
          emit('timer-updated', props.item)
          if (timerInterval.value) {
            clearInterval(timerInterval.value)
            timerInterval.value = null
          }
        }
      }, 1000)
    } else {
      // 继续正计时
      timerInterval.value = window.setInterval(() => {
        elapsedTime.value++
      }, 1000)
    }
  }

  // 通知父组件更新状态
  emit('timer-updated', {
    ...props.item,
    isPaused: isPaused.value,
    pausedTime: pausedTime.value,
  })
}

// 增加时间（仅倒计时）
const addTime = (hours: number) => {
  if (props.item.type === '倒计时') {
    // 增加剩余时间（秒）
    remainingTime.value += hours * 60 * 60

    // 更新计时器时长
    props.item.duration += hours

    // 通知父组件更新状态
    emit('timer-updated', props.item)
  }
}

// 结束计时
const finishTimer = () => {
  ElMessageBox.confirm('确定要结束计时吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 清除计时器
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }

      // 标记为已完成
      props.item.isFinish = true

      // 对于正计时类型，保存最终计时结果
      if (props.item.type === '正计时') {
        props.item.duration = elapsedTime.value / 3600 // 将秒转换为小时
      }

      // 通知父组件更新状态
      emit('timer-updated', props.item)
    })
    .catch(() => {
      // 取消操作
    })
}

// 删除计时器
const deleteTimer = () => {
  ElMessageBox.confirm('确定要删除这个计时器吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 通知父组件删除此计时器
      emit('delete-timer', props.item)
    })
    .catch(() => {
      // 取消操作
    })
}

// 初始化计时器
onMounted(() => {
  // 初始化暂停状态
  isPaused.value = !!props.item.isPaused
  pausedTime.value = props.item.pausedTime || null

  // 如果处于暂停状态，不启动计时器
  if (isPaused.value) {
    return
  }

  // 如果是倒计时
  if (props.item.type === '倒计时' && !props.item.isFinish) {
    const totalSeconds = props.item.duration * 60 * 60
    const endTime = props.item.startTime + props.item.duration * 60 * 60 * 1000
    const now = Date.now()

    // 计算剩余时间（秒）
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
    remainingTime.value = remaining

    // 如果已经结束，不开始计时
    if (remaining <= 0) {
      props.item.isFinish = true
      // 通知父组件更新状态
      emit('timer-updated', props.item)
      return
    }

    // 开始倒计时
    timerInterval.value = window.setInterval(() => {
      remainingTime.value--

      // 时间到
      if (remainingTime.value <= 0) {
        props.item.isFinish = true
        // 通知父组件更新状态
        emit('timer-updated', props.item)
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }
      }
    }, 1000)
  }
  // 如果是正计时
  else if (props.item.type === '正计时') {
    // 如果已完成，直接设置计时值
    if (props.item.isFinish) {
      elapsedTime.value = Math.round(props.item.duration * 3600) // 将小时转为秒
      return
    }

    const startTime = props.item.startTime
    const now = Date.now()

    // 计算已过时间（秒）
    elapsedTime.value = Math.floor((now - startTime) / 1000)

    // 开始正计时
    timerInterval.value = window.setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }
})

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
})
</script>

<style scoped>
.timer-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #000;
  display: flex;
  flex-direction: column;
  height: 180px;
}

.timer-panel.vip {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
}

.timer-panel.finished {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.timer-panel.paused {
  background-color: #f3f3f3;
  border-left: 4px solid #9e9e9e;
}

.timer-panel.finished .time-info {
  color: #4caf50;
  font-size: 22px;
  line-height: 28px;
  padding-left: 10px;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.user-name {
  font-weight: bold;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.vip .user-type {
  background-color: #ffc107;
}

.user-type,
.timer-type {
  background-color: #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.timer-type {
  background-color: #e0e0e0;
  color: #fff;
}

.timer-type.countdown {
  background-color: #2196f3;
}

.timer-type.countup {
  background-color: #4caf50;
}

.timer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.time-display {
  text-align: center;
}

.time {
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
}

.time.finished {
  color: #4caf50;
}

.time.paused {
  color: #9e9e9e;
}

.progress-bar {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #2196f3;
  transition: width 1s linear;
}

.timer-controls {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.delete-button {
  background-color: #f56c6c;
  color: #fff;
  margin: 0 auto;
  width: 100px;
}

.time-info-text {
  font-size: 22px;
  color: #4caf50;
  line-height: 28px;
  padding-left: 10px;
}
</style>
