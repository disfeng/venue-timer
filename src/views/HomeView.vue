<template>
  <div class="action">
    <div style="flex: 0 0 240px">
      <span class="label" style="flex: 0 0 100px">是否为会员：</span>
      <el-radio-group v-model="isVip">
        <el-radio-button label="非会员" />
        <el-radio-button label="会员" />
      </el-radio-group>
    </div>
    <div style="flex: 0 0 230px">
      <span class="label">用户标识：</span>
      <div>
        <el-input v-model="timerName" placeholder="请输入用户标识用户" />
      </div>
    </div>
    <!-- 计时类型，正计时，倒计时 -->
    <div style="flex: 0 0 230px">
      <span class="label">计时类型：</span>
      <el-radio-group v-model="timerType">
        <el-radio-button label="倒计时" />
        <el-radio-button label="正计时" />
      </el-radio-group>
    </div>
    <!-- 计时时长 -->
    <div style="flex: 0 0 130px" v-if="timerType === '倒计时'">
      <span class="label">计时时长：</span>
      <el-input-number
        v-model="timerDuration"
        controls-position="right"
        :min="0.5"
        :max="12"
        :step="0.5"
        placeholder="请输入计时时长"
      >
        <template #suffix>
          <span>小时</span>
        </template>
      </el-input-number>
    </div>
    <div>
      <el-button type="primary" @click="addTimer">添加计时器</el-button>
    </div>
    <div>
      <el-button type="danger" @click="deleteFinishedTimers">删除已完成</el-button>
    </div>
    <div class="flex-atto"></div>
  </div>
  <div class="timer-list">
    <div class="timer-item" v-for="item in timerList" :key="item.name">
      <TimerPanel :item="item" @timer-updated="updateTimer" @delete-timer="deleteTimer" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TimerPanel from '@/components/TimerPanel.vue'
import HomeView from '@/views/HomeView.vue'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storageService, type TimerItem } from '@/services/storageService'

const isVip = ref('非会员')
const timerName = ref('')
const timerType = ref('倒计时')
const timerDuration = ref(1)
const timerList = ref<TimerItem[]>([])

// 页面加载时，从存储服务加载计时器数据
onMounted(async () => {
  timerList.value = await storageService.loadTimers()
})

const addTimer = async () => {
  if (timerName.value === '') {
    ElMessage.error('请输入用户标识')
    return
  }

  // 添加新计时器
  timerList.value.push({
    name: timerName.value,
    type: timerType.value,
    // 倒计时才需要初始时长，正计时时长为0
    duration: timerType.value === '倒计时' ? timerDuration.value : 0,
    isVip: isVip.value,
    startTime: new Date().getTime(),
    isFinish: false,
    isPaused: false,
    pausedTime: null,
  })

  // 保存到存储服务
  await storageService.saveTimers(timerList.value)

  // 清空输入框
  timerName.value = ''
  timerDuration.value = 1
  isVip.value = '非会员'
  timerType.value = '倒计时'
}

// 更新计时器
const updateTimer = async (updatedTimer: TimerItem) => {
  // 更新计时器列表中的计时器
  const index = timerList.value.findIndex((timer) => timer.name === updatedTimer.name)
  if (index !== -1) {
    timerList.value[index] = updatedTimer
    // 保存到存储服务
    await storageService.saveTimers(timerList.value)
  }
}

// 删除已完成的计时器
const deleteFinishedTimers = async () => {
  // 检查是否有已完成的计时器
  const hasFinished = timerList.value.some((timer) => timer.isFinish)

  if (!hasFinished) {
    ElMessage.info('没有已完成的计时器可删除')
    return
  }

  ElMessageBox.confirm('确定要删除所有已完成的计时器吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 过滤出未完成的计时器
      timerList.value = timerList.value.filter((timer) => !timer.isFinish)

      // 保存到存储服务
      await storageService.saveTimers(timerList.value)

      ElMessage.success('已删除所有已完成的计时器')
    })
    .catch(() => {
      // 取消操作
    })
}

// 删除单个计时器
const deleteTimer = async (timer: TimerItem) => {
  // 从列表中移除计时器
  timerList.value = timerList.value.filter((t) => t.name !== timer.name)

  // 保存到存储服务
  await storageService.saveTimers(timerList.value)

  ElMessage.success('计时器已删除')
}
</script>
<style scoped>
.action {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  border-bottom: 1px solid #a3a3a330;
  > div {
    display: flex;
    align-items: left;
    .label {
      flex: 0 0 80px;
      line-height: 32px;
    }
  }
  .flex-atto {
    flex: 1;
  }
}
.timer-list {
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  .timer-item {
    flex: 0 1 calc(25% - (20px * 3 / 4));
    min-width: 300px;
  }
}
</style>
