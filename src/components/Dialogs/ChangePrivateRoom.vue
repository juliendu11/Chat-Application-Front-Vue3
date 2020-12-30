<template>
  <Card>
    <template v-slot:header>
      <h2>CHANGE ROOM</h2>
    </template>
    <template v-slot:content>
      <div class="form-control">
        <input v-model="password" type="password" placeholder="Password" />
      </div>
    </template>
    <template v-slot:actions>
      <div>
        <a
        id="changePrivateRoomAccedBtn"
          href="#"
          class="btn btn-primary-light strong-text"
          @click="accept(true)"
          >Acced</a
        >
        <a
          id="changePrivateRoomCancelBtn"
          href="#"
          class="btn btn-danger-light strong-text"
          @click="accept(false)"
          >Cancel</a
        >
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/Card.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ChangePrivateRoom',
  components: { Card },
  setup (props, { emit }) {
    const password = ref<string>('')

    const accept = (value: boolean) => {
      emit('accept', {
        value,
        password: password.value
      })
    }

    return {
      password,
      accept
    }
  }
})
</script>
