<template>
  <div class="register-page">
    <div class="container">
      <form @submit.prevent="processToRegister">
        <Card>
          <template v-slot:header>
            <h2>REGISTER</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <input
                v-model="state.username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div class="form-control">
              <input v-model="state.email" type="text" placeholder="Email" />
            </div>
            <div class="form-control">
              <input
                v-model="state.password"
                type="password"
                placeholder="Password"
                @keypress="keyPressHandler"
              />
            </div>
          </template>
          <template v-slot:actions>
            <input
              class="btn btn-primary strong-text"
              type="submit"
              value="Create account"
            />
            <a href="#" class="btn btn-light strong-text" @click="gotoLogin"
              >Go to login</a
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
import { register } from '@/services/api.service'
import DialogManager from '@/classes/DialogManager'

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

    const dialogMananger = new DialogManager(instance)

    const processToRegister = async () => {
      try {
        dialogMananger.showLoadingDialog('')
        const { error, message } = await register(
          state.username,
          state.email,
          state.password
        )
        if (error) {
          dialogMananger.showErrorMessage(message, 'Error during registration')
          return
        }
        dialogMananger.showSuccessMessage(message)
      } catch (error) {
        dialogMananger.showErrorMessage(
          error.message,
          'Error during registration'
        )
      }
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
