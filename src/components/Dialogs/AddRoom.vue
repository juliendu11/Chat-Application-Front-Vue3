<template>
  <Card>
    <template v-slot:header>
      <h2>ADD ROOM</h2>
    </template>
    <template v-slot:content>
      <div class="form-control">
        <input v-model="name" type="text" placeholder="Room name" />
      </div>
      <div class="form-control">
        <input v-model="isPrivate" type="checkbox" name="isPrivate" />
        <label for="isPrivate">Is private</label>
      </div>
      <div class="form-control">
        <input v-model="password" type="password" placeholder="Password" />
      </div>
    </template>
    <template v-slot:actions>
      <div>
        <a
          href="#"
          class="btn btn-primary-light strong-text"
          @click="accept(true)"
          >Add</a
        >
        <a
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
  name: 'AddRoom',
  components: { Card },
  setup (props, { emit }) {
    const name = ref<string>('')
    const isPrivate = ref<boolean>(false)
    const password = ref<string>('')

    const accept = (value: boolean) => {
      emit('accept', {
        value,
        name: name.value,
        isPrivate: isPrivate.value,
        password: password.value
      })
    }

    return {
      name,
      isPrivate,
      password,
      accept
    }
  }
})
</script>
