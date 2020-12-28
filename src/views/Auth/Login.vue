<template>
  <div class="login-page">
    <div class="container">
      <form @submit.prevent="processToLogin">
        <Card>
          <template v-slot:header>
             <h2>LOGIN</h2>
          </template>
          <template v-slot:content>
           <div class="form-control">
              <input
                v-model="state.id"
                type="text"
                placeholder="Username or email"
              />
            </div>
            <div class="form-control">
              <input
                v-model="state.password"
                type="password"
                placeholder="Password"
              />
              <a
                href="#"
                class="btn btn-small btn-light"
                @click="gotoForgotPassword"
                >Forgot-password ?</a
              >
            </div>
          </template>
          <template v-slot:actions>
            <input
              class="btn btn-primary strong-text"
              type="submit"
              value="Login"
            />
            <a
              href="#"
              class="btn btn-light strong-text"
              @click="gotoCreateAccount"
              >Create account</a
            >
          </template>
        </Card>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/api.service'
import { updateToken } from '@/services/token.service'
import DialogManager from '@/classes/DialogManager'

export default defineComponent({
  name: 'Login',
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const state = reactive({
      id: '',
      password: ''
    })

    const dialogMananger = new DialogManager(instance)

    const processToLogin = async () => {
      try {
        dialogMananger.showLoadingDialog('')
        const { error, message } = await login(state.id, state.password)
        if (error) {
          dialogMananger.showErrorMessage(message, 'Error during login')
          return
        }
        updateToken(message)
        dialogMananger.forceClose()
        router.push({
          name: 'Home'
        })
      } catch (error) {
        dialogMananger.showErrorMessage(error.message)
      }
    }

    const gotoCreateAccount = () => {
      router.push({
        name: 'Register'
      })
    }

    const gotoForgotPassword = () => {
      router.push({
        name: 'Password recovery'
      })
    }

    return { state, processToLogin, gotoCreateAccount, gotoForgotPassword }
  }
})
</script>
