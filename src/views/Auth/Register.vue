<template>
  <div class="register-page">
    <div class="container">
      <Form
        @submit="processToRegister"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <Card>
          <template v-slot:header>
            <h2>REGISTER</h2>
          </template>
          <template v-slot:content>
            <div class="form-control">
              <label for="username">Username:</label>
              <Field
                name="username"
                id="username"
                type="text"
                v-model="state.username"
                :class="{ 'is-invalid': errors.username }"
              />
              <div class="invalid-feedback">{{ errors.username }}</div>
            </div>
            <div class="form-control">
               <label for="email">Email:</label>
               <Field
               v-model="state.email"
                name="email"
                id="email"
                type="text"
                :class="{ 'is-invalid': errors.email }"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="form-control">
              <label for="password">Password:</label>
              <Field
              v-model="state.password"
                name="password"
                type="password"
                id="password"
                :class="{ 'is-invalid': errors.password }"
                ref="password"
              />
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="form-control">
              <label for="confirmpassword">Retape password:</label>
              <Field
              v-model="state.repassword"
                name="confirmpassword"
                type="password"
                id="confirmpassword"
                :class="{ 'is-invalid': errors.confirmPassword }"
              />
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
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
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

import { useRouter } from 'vue-router'
import { register } from '@/services/api.service'
import DialogManager from '@/classes/DialogManager'

import RegisterState from '@/interfaces/State/RegisterState'
export default defineComponent({
  name: 'Register',
  components: {
    Form,
    Field
  },
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const state = reactive<RegisterState>({
      username: '',
      email: '',
      repassword: '',
      password: ''
    })

    const schema = Yup.object().shape({
      username: Yup.string().required('Username is required'),
      email: Yup.string()
        .required('Email is required')
        .email('Email is invalid'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
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

    return { state, processToRegister, gotoLogin, schema }
  }
})
</script>
