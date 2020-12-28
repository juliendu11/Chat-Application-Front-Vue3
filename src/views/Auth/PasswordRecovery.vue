<template>
  <div class="login-page">
    <div class="container">
      <form v-if="state.requested" @submit.prevent="processToRecoverPassword">
        <Card>
          <template v-slot:header>
            <h2>FORGOT PASSWORD</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <input
                v-model="state.id"
                type="text"
                placeholder="Username or email"
              />
            </div>
          </template>
          <template v-slot:actions>
            <input
              class="btn btn-primary strong-text"
              type="submit"
              value="Send"
            />
            <a href="#" class="btn btn-light strong-text" @click="gotoLogin"
              >Go to login</a
            >
          </template>
        </Card>
      </form>
      <form v-else @submit.prevent="processToUpdatePassword">
          <Card>
          <template v-slot:header>
             <h2>CHANGE PASSWORD</h2>
          </template>
          <template v-slot:content>
             <div class="form-control">
              <input
                v-model="state.password"
                type="password"
                placeholder="Password"
              />
            </div>
          </template>
          <template v-slot:actions>
           <input
              class="btn btn-primary strong-text"
              type="submit"
              value="Update password"
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
import { defineComponent, reactive, getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { forgotPassword, resetPassword } from '@/services/api.service'
import { updateToken } from '@/services/token.service'
import DialogManager from '@/classes/DialogManager'

export default defineComponent({
  name: 'PasswordRecovery',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const state = reactive({
      id: '',
      requested: true,
      password: '',
      token: ''
    })

    const dialogMananger = new DialogManager(instance)

    const processToRecoverPassword = async () => {
      try {
        dialogMananger.showLoadingDialog('')
        const { error, message } = await forgotPassword(state.id)
        if (error) {
          dialogMananger.showErrorMessage(
            message,
            'Error during recovery password'
          )
          return
        }
        dialogMananger.showSuccessMessage(message)
      } catch (error) {
        dialogMananger.showErrorMessage(error.message)
      }
    }

    const processToUpdatePassword = async () => {
      try {
        dialogMananger.showLoadingDialog('')
        const { error, message } = await resetPassword(
          state.id,
          state.token,
          state.password
        )
        if (error) {
          dialogMananger.showErrorMessage(
            message,
            'Error during update password'
          )
          return
        }
        dialogMananger.showSuccessMessage(message)
      } catch (error) {
        dialogMananger.showErrorMessage(error.message)
      }
    }

    onMounted(() => {
      // IF LINK IN RECEIVED EMAIL SHOW BLOCK FOR UPDATE PASSWORD
      if (route.query.email && route.query.token) {
        state.id = route.query.email.toString()
        state.token = route.query.token.toString()
        state.requested = false
      }
    })

    const gotoLogin = () => {
      router.push({
        name: 'Login'
      })
    }

    return {
      state,
      processToRecoverPassword,
      processToUpdatePassword,
      gotoLogin
    }
  }
})
</script>
