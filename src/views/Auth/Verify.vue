<template>
  <div class="verify-page">
    <div class="container">
      <Card :customClasses="'verify-card'">
          <template v-slot:header>
            <h2>VERIFY</h2>
          </template>
          <template v-slot:content>
             <BounceLoader v-if="state.loadin" class="loader"/>
              <p v-else>{{state.message}}</p>
          </template>
          <template v-slot:actions>
             <a href="#" class="btn btn-light strong-text" @click="gotoLogin">Go to login</a>
          </template>
        </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verify } from '@/services/api.service'

import BounceLoader from 'vue-spinner/src/BounceLoader.vue'

import DialogManager from '@/classes/DialogManager'

export default defineComponent({
  name: 'Register',
  components: { BounceLoader },
  setup () {
    const router = useRouter()
    const instance = getCurrentInstance()
    const route = useRoute()

    const dialogMananger = new DialogManager(instance)

    const state = reactive({
      loading: false,
      message: ''
    })

    const gotoLogin = () => {
      router.push({
        name: 'Login'
      })
    }

    const processToVerify = async () => {
      state.loading = true
      try {
        if (!route.query || !route.query.email || !route.query.token) {
          dialogMananger.showErrorMessage('Missing informations in url')
          gotoLogin()
          return
        }

        const { error, message } = await verify(
          route.query.email.toString(),
          route.query.token.toString()
        )
        if (error) {
          dialogMananger.showErrorMessage(message)
          return
        }
        dialogMananger.showSuccessMessage(message)
        state.message = message
      } catch (error) {
        dialogMananger.showErrorMessage(error.message)
      } finally {
        state.loading = false
      }
    }

    onMounted(() => {
      processToVerify()
    })

    return { gotoLogin, state }
  }
})
</script>

<style>
</style>
