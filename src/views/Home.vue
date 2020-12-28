<template>
  <div class="home-page">
    <div class="container">
      <div class="direct-chat-container">
        <Card v-if="state.rooms && state.rooms.length !== 0">
          <template v-slot:content>
            <div class="direct-chat-rooms-list">
              <template v-for="room in state.rooms" :key="room.name">
                <a
                  href="#"
                  class="btn btn-primary light-border"
                  :class="
                    state.roomSelected === room ? 'btn-primary' : 'btn-light'
                  "
                  @click.prevent="changeRoom(room)"
                  >{{ room.name }}</a
                >
              </template>
            </div>
          </template>
        </Card>
        <Card>
          <template v-slot:content>
            <div>d</div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance, reactive } from 'vue'
import { getRooms } from '@/services/api.service'
import DialogManager from '@/classes/DialogManager'

export default defineComponent({
  name: 'Home',
  setup () {
    const instance = getCurrentInstance()
    const dialogMananger = new DialogManager(instance)

    const state = reactive({
      rooms: [],
      roomSelected: ''
    })

    onMounted(async () => {
      const { error, message, values } = await getRooms()
      if (error) {
        dialogMananger.showErrorMessage(message)
        return
      }
      state.rooms = values
      state.roomSelected = state.rooms[0]
    })

    const changeRoom = (room: any) => {
      state.roomSelected = room
    }

    return {
      state,
      changeRoom
    }
  }
})
</script>
