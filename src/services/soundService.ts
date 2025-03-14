// 声音服务，用于处理应用中的声音播放
export const soundService = {
  // 计时结束提示音
  timerEndSound: new Audio('/sounds/timer-end.wav'),

  // 声音开关状态，默认开启
  soundEnabled: localStorage.getItem('sound-enabled') !== 'false',

  // 播放计时结束提示音
  playTimerEndSound() {
    // 如果声音被禁用，则不播放
    if (!this.soundEnabled) return

    // 重置音频到开始位置（允许重复播放）
    this.timerEndSound.currentTime = 0
    // 播放提示音
    this.timerEndSound.play().catch((error) => {
      console.error('播放提示音失败:', error)
    })
  },

  // 切换声音开关
  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    localStorage.setItem('sound-enabled', this.soundEnabled.toString())
    return this.soundEnabled
  },

  // 获取当前声音状态
  isSoundEnabled() {
    return this.soundEnabled
  },

  // 预加载所有声音
  async preloadSounds() {
    try {
      // 添加详细的加载状态监听
      this.timerEndSound.addEventListener('loadeddata', () => {
        console.log('音频已加载')
      })

      this.timerEndSound.addEventListener('error', (e) => {
        console.error('音频加载错误:', this.timerEndSound.error)
      })

      await this.timerEndSound.load()
    } catch (error) {
      console.error('预加载失败:', error)
    }
  },

  // 测试提示音播放
  testSound() {
    // 重置音频到开始位置（允许重复播放）
    this.timerEndSound.currentTime = 0
    console.log('测试提示音播放')
    // 播放提示音（无论声音开关是否启用）
    this.timerEndSound.loop = true
    this.timerEndSound.play().catch((error) => {
      console.error('播放提示音失败:', error)
    })
  },

  // 停止提示音
  stopSound() {
    this.timerEndSound.pause()
    this.timerEndSound.currentTime = 0
  },
}
