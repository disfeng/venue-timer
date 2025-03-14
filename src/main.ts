import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { soundService } from './services/soundService'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 预加载声音
soundService.preloadSounds()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
