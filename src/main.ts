import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Swal from 'sweetalert2'

import './assets/styles/app.scss'

const app = createApp(App)

const swalWithCustomButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
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

app.use(store)
app.use(router)
app.mount('#app')
