<template>
  <div class="login-page">
    <div class="container">
      <Form
        @submit="processToLogin"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <Card>
          <template v-slot:header>
            <h2>LOGIN</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <label for="id">Username or email:</label>
              <Field
                name="id"
                id="id"
                type="text"
                v-model="state.id"
                :class="{ 'is-invalid': errors.id }"
              />
              <div class="invalid-feedback">{{ errors.id }}</div>
            </div>
            <div class="form-control">
              <label for="password">Password:</label>
              <Field
                name="password"
                type="password"
                id="password"
                v-model="state.password"
                :class="{ 'is-invalid': errors.password }"
              />
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="form-control">
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
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

import { useRouter } from 'vue-router'
import { login } from '@/services/api.service'
import { updateToken } from '@/services/token.service'
import DialogManager from '@/classes/DialogManager'

import LoginState from '@/interfaces/State/LoginState'
export default defineComponent({
  name: 'Login',
  components: { Form, Field },
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const state = reactive<LoginState>({
      id: '',
      password: ''
    })

    const dialogMananger = new DialogManager(instance)

    const schema = Yup.object().shape({
      id: Yup.string().required('Username or email is required'),
      password: Yup.string().required('Password is required')
    })

    const processToLogin = async () => {
      try {
        dialogMananger.showLoadingDialog('')
        const { error, message, value } = await login(state.id, state.password)
        if (error) {
          dialogMananger.showErrorMessage(message, 'Error during login')
          return
        }
        updateToken(message)
        dialogMananger.forceClose()
        localStorage.setItem('username', value)
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

    return {
      state,
      processToLogin,
      gotoCreateAccount,
      gotoForgotPassword,
      schema
    }
  }
})
</script>
