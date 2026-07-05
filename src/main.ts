import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { useSettingsStore } from './stores/settings'
import { initI18n } from './i18n'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化 i18n(同步 document.documentElement.lang 到当前 locale)
initI18n()

// 在挂载前先初始化设置(主题等)
const settings = useSettingsStore()
settings.applyTheme()

app.mount('#app')
