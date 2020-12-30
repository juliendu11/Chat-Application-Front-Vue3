<template>
  <Card>
    <template v-slot:header>
      <h2>ADD ROOM</h2>
    </template>
    <template v-slot:content>
      <div class="form-control">
        <input v-model="name" type="text" placeholder="Room name" />
      </div>
      <div class="form-control form-control-switch">
        <span>Is private</span>
        <label class="switch">
          <input
            type="checkbox"
            v-model="isPrivate"
          />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="form-control" v-show="isPrivate">
        <input v-model="password" type="password" placeholder="Password" />
      </div>
    </template>
    <template v-slot:actions>
      <div>
        <a
        id="addRoomAddBtn"
          href="#"
          class="btn btn-primary-light strong-text"
          @click="accept(true)"
          >Add</a
        >
        <a
        id="addRoomCancelBtn"
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
