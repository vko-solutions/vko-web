import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// inicia auth após montar (evita piscar de rota)
import { useAuth } from '@/stores/auth'
useAuth().init()

