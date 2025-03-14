// 计时器工作线程
let timer = null
let remaining = 0

// 处理主线程消息
self.onmessage = function (e) {
  const { action, duration } = e.data

  // 开始计时
  if (action === 'start') {
    // 清除现有计时器
    if (timer) {
      clearInterval(timer)
    }

    // 设置剩余时间
    remaining = duration

    // 发送初始状态
    self.postMessage({ remaining })

    // 创建计时器
    timer = setInterval(() => {
      remaining--
      self.postMessage({ remaining })

      // 时间到，清除计时器
      if (remaining <= 0) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  }

  // 暂停计时
  else if (action === 'pause') {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 恢复计时
  else if (action === 'resume') {
    if (!timer && remaining > 0) {
      timer = setInterval(() => {
        remaining--
        self.postMessage({ remaining })

        if (remaining <= 0) {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
  }

  // 重置计时
  else if (action === 'reset') {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    remaining = duration || 0
    self.postMessage({ remaining })
  }
}
