import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { clearToken } from './services/token.service'

import Swal from 'sweetalert2'

import Card from './components/Card.vue'

import './assets/styles/app.scss'

require('dotenv').config()

const app = createApp(App)

const swalWithCustomButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger',
    content: 'normal-text'
  },
  buttonsStyling: false
})

app.config.globalProperties.$showSwalError = (text: string, title = '') => {
  swalWithCustomButtons.fire({
    title: title || '',
    text: text,
    icon: 'error',
    heightAuto: false
  })
}

app.config.globalProperties.$showSwalSuccess = (text: string, title = '') => {
  swalWithCustomButtons.fire({
    title: title || '',
    text: text,
    icon: 'success',
    heightAuto: false
  })
}

app.config.globalProperties.$showSwalInfo = (text: string, title = '') => {
  swalWithCustomButtons.fire({
    title: title || '',
    text: text,
    icon: 'info',
    heightAuto: false
  })
}

app.config.globalProperties.$showSwalProgress = (text: string, callback: Function, title = '') => {
  swalWithCustomButtons.fire({
    title: title || 'Please wait...',
    text: text,
    allowOutsideClick: false
  })
  swalWithCustomButtons.showLoading()
}

app.config.globalProperties.$forceCloseSwal = () => {
  swalWithCustomButtons.close()
}

app.config.globalProperties.$forceLogout = () => {
  clearToken()
  router.push('/')
}

app.component('Card', Card)

app.use(store)
app.use(router)
app.mount('#app')
