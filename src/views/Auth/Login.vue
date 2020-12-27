<template>
    <div class="login-page">
        <div class="container">
            <div class="card">
               <form action="">
                    <h2>LOGIN</h2>
                    <div class="card-content">
                         <div class="form-control">
                        <input v-model="state.id" type="text" placeholder="Username or email">
                    </div>
                    <div class="form-control">
                        <input v-model="state.password" type="password" placeholder="Password">
                    </div>
                    </div>
                    <div class="card-actions">
                        <a href="#" class="btn btn-primary" @click="processToLogin">Login</a>
                        <a href="#" class="btn btn-light" @click="gotoCreateAccount">Create account</a>
                    </div>
               </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/api.service'
import { updateToken } from '@/services/token.service'

export default defineComponent({
  name: 'Login',
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const state = reactive({
      id: '',
      password: ''
    })

    const processToLogin = async () => {
      const { error, message } = await login(state.id, state.password)
      if (error) {
        if (instance) instance.appContext.config.globalProperties.$showSwalError(message, 'Error during login')
        return
      }
      updateToken(message)
      router.push({
        name: 'Home'
      })
    }

    const gotoCreateAccount = () => {
      router.push({
        name: 'Register'
      })
    }

    return { state, processToLogin, gotoCreateAccount }
  }
})
</script>
