<template>
  <div class="register-page">
    <div class="container">
      <div class="card">
        <form action="">
          <h2>REGISTER</h2>
          <div class="card-content">
            <div class="form-control">
              <input
                v-model="state.id"
                type="text"
                placeholder="Username"
              />
            </div>
            <div class="form-control">
              <input
                v-model="state.email"
                type="text"
                placeholder="Email"
              />
            </div>
             <div class="form-control">
              <input
                v-model="state.password"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="card-actions">
            <a href="#" class="btn btn-primary" @click="processToRegister"
              >Create account</a
            >
            <a href="#" class="btn btn-light" @click="gotoLogin">Login</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/api.service'
import { updateToken } from '@/services/token.service'

export default defineComponent({
  name: 'Register',
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const state = reactive({
      username: '',
      email: '',
      password: ''
    })

    const processToRegister = async () => {
      const { error, message } = await register(
        state.username,
        state.email,
        state.password
      )
      if (error) {
        if (instance) {
          instance.appContext.config.globalProperties.$showSwalError(
            message,
            'Error during registration'
          )
        }
        return
      }
      if (instance) { instance.appContext.config.globalProperties.$showSwalSuccess(message) }
    }

    const gotoLogin = () => {
      router.push({
        name: 'Login'
      })
    }

    return { state, processToRegister, gotoLogin }
  }
})
</script>
