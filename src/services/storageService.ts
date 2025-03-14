import { ref } from 'vue'

// 定义计时器数据类型
export interface TimerItem {
  name: string
  type: string
  duration: number
  isVip: string
  startTime: number
  isFinish: boolean
  isPaused?: boolean // 是否暂停
  pausedTime?: number | null // 暂停时的时间戳
}

// 存储服务
export const storageService = {
  // 保存计时器列表
  async saveTimers(timers: TimerItem[]): Promise<void> {
    // 检查并更新每个计时器的状态
    const updatedTimers = timers.map((timer) => {
      // 对于倒计时类型的计时器，检查是否已完成
      if (timer.type === '倒计时' && !timer.isFinish) {
        const endTime = timer.startTime + timer.duration * 60 * 60 * 1000
        if (Date.now() >= endTime) {
          return { ...timer, isFinish: true }
        }
      }
      return timer
    })

    // 保存到本地存储
    localStorage.setItem('archery-timers', JSON.stringify(updatedTimers))
  },

  // 加载计时器列表
  async loadTimers(): Promise<TimerItem[]> {
    try {
      // 从本地存储加载
      const storedData = localStorage.getItem('archery-timers')
      const storedTimers = storedData ? (JSON.parse(storedData) as TimerItem[]) : null

      if (!storedTimers) {
        return []
      }

      // 更新计时器状态
      const updatedTimers = storedTimers.map((timer) => {
        // 对于倒计时类型，检查是否应该标记为完成
        if (timer.type === '倒计时' && !timer.isFinish) {
          const endTime = timer.startTime + timer.duration * 60 * 60 * 1000
          if (Date.now() >= endTime) {
            return { ...timer, isFinish: true }
          }
        }
        return timer
      })

      // 如果有状态变化，保存更新后的数据
      if (JSON.stringify(updatedTimers) !== JSON.stringify(storedTimers)) {
        await this.saveTimers(updatedTimers)
      }

      return updatedTimers
    } catch (error) {
      console.error('加载计时器数据失败:', error)
      return []
    }
  },
}
