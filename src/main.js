import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authStore } from './stores/auth'
import { podcastStore } from './stores/podcasts'
import './style.css'

const app = createApp(App)
app.use(router)

// Initialize Firebase auth state and podcasts before mounting
Promise.all([
  authStore.init(),
  podcastStore.init()
]).then(() => {
  app.mount('#app')
})
