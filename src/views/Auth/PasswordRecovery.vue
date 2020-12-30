<template>
  <div class="login-page">
    <div class="container">
      <Form
        v-if="state.requested"
        @submit="processToRecoverPassword"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <Card>
          <template v-slot:header>
            <h2>FORGOT PASSWORD</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <Field
                name="id"
                type="text"
                v-model="state.id"
                :class="{ 'is-invalid': errors.id }"
              />
              <div class="invalid-feedback">{{ errors.id }}</div>
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
      </Form>
      <Form
        v-else
        @submit="processToUpdatePassword"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <Card>
          <template v-slot:header>
            <h2>CHANGE PASSWORD</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <Field
                name="password"
                type="password"
                v-model="state.password"
                :class="{ 'is-invalid': errors.password }"
              />
              <div class="invalid-feedback">{{ errors.password }}</div>
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
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import { useRouter, useRoute } from 'vue-router'
import { forgotPassword, resetPassword } from '@/services/api.service'
import DialogManager from '@/classes/DialogManager'

import PasswordRecoveryState from '@/interfaces/State/PasswordRecoveryState'
export default defineComponent({
  name: 'PasswordRecovery',
  components: { Form, Field },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const state = reactive<PasswordRecoveryState>({
      id: '',
      requested: true,
      password: '',
      token: ''
    })

    const dialogMananger = new DialogManager(instance)

    const schema = Yup.object().shape({
      id: Yup.string().required('Username or email is required')
    })

    const schema2 = Yup.object().shape({
      password: Yup.string().required('Password is required')
    })

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
      gotoLogin,
      schema,
      schema2
    }
  }
})
</script>
