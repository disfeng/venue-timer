<template>
  <div class="main">
    <div class="header">
      <h3>多用户计时器</h3>
      <div class="timenow">{{ timenow }}</div>
    </div>
    <HomeView />
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TimerPanel from '@/components/TimerPanel.vue'
import HomeView from '@/views/HomeView.vue'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const isVip = ref('非会员')
const timerName = ref('')
const timerType = ref('倒计时')
const timerDuration = ref(1)
const timerList = ref<
  { name: string; type: string; duration: number; isVip: string; startTime: number }[]
>([])
const addTimer = () => {
  timerList.value.push({
    name: timerName.value,
    type: timerType.value,
    duration: timerDuration.value,
    isVip: isVip.value,
    startTime: new Date().getTime(),
  })
}
const timenow = ref('')
onMounted(() => {
  setInterval(() => {
    timenow.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  font-size: 20px;
  border-bottom: 1px solid #a3a3a330;
  .timenow {
    font-size: 22px;
    /* 等宽字体 */
    font-family: monospace;
  }
}
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
