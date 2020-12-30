<template>
    <div v-show="dialog.show" class="dialog-backdrop"></div>
  <div v-show="dialog.show" class="dialog-container">
    <AddRoom v-if="dialog.isAddRoom" @accept="acceptAddRoom" />
    <ChangePrivateRoom v-if="dialog.isChangePrivateRoom" @accept="acceptChangeRoom"/>
  </div>
  <div class="home-page">
    <div class="container">
      <div class="nav-bar">
        <div class="branding">
          <img src="/img/icon.png" alt="Logo" />
          <h2>Direct chat APP</h2>
        </div>
        <div>
          <a
            href="#"
            class="btn btn-secondary btn-medium strong-text"
            @click.prevent="logout"
            >Logout</a
          >
        </div>
      </div>
      <div class="direct-chat-container">
        <Card v-if="state.rooms && state.rooms.length !== 0">
          <template v-slot:content>
            <h3>Rooms</h3>
            <hr />
            <div class="direct-chat-rooms-list">
              <template v-for="room in state.rooms" :key="room.name">
                <a
                  href="#"
                  class="btn btn-primary light-border"
                  :class="
                    state.roomSelected === room ? 'btn-primary' : 'btn-light'
                  "
                  @click.prevent="showDialogChangeRoom(room)"
                  >{{ room.name }}</a
                >
                <div class="direct-chat-members-list">
                  <span
                    v-for="member in state.onlineMembers.filter(
                      (x) => x.room === room.name
                    )"
                    :key="member.username"
                  >
                    <div class="dot"></div>
                    {{ member.username }}
                  </span>
                </div>
              </template>
            </div>
            <a
              href="#"
              class="btn btn-secondary"
              @click.prevent="showDialogCreateRoom"
              >New room</a
            >
          </template>
        </Card>
        <Card>
          <template v-slot:content>
            <div @scroll="messagesScrolling" class="direct-chat-messages-list" id="messagesList">
              <MessageCard
                v-for="(message, i) in state.messages"
                :key="i"
                :text="message.text"
                :owner="message.owner"
                :right="message.owner === myUsername"
                :date="message.sendAt"
              />
            </div>
            <form @submit.prevent="sendMessage">
              <div class="direct-chat-input-message">
                <div class="form-control">
                  <textarea
                    rows="2"
                    placeholder="Write a message"
                    v-model="state.messageToSend"
                  ></textarea>
                </div>

                <input class="btn btn-primary" type="submit" value="Send" />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  reactive,
  ref,
  watch,
  onBeforeUnmount
} from 'vue'

import { useRouter } from 'vue-router'

import {
  refreshToken
} from '@/services/api.service'
import { updateToken, clearToken } from '@/services/token.service'

import { REFRESH_JWT_TIME } from '@/config'

import DialogManager from '@/classes/DialogManager'

import MessageCard from '@/components/MessageCard.vue'
import AddRoom from '@/components/Dialogs/AddRoom.vue'
import ChangePrivateRoom from '@/components/Dialogs/ChangePrivateRoom.vue'

import HomeState from '@/interfaces/State/HomeState'
import Pagination from '@/interfaces/Pagination'
import Dialog from '@/interfaces/Dialog'

import { throttle } from '@/utils/scrolling'

import RoomManager from './RoomManage'
import MessageManager from './MessageManage'
import SocketManager from './SocketManage'

export default defineComponent({
  name: 'Home',
  components: { MessageCard, AddRoom, ChangePrivateRoom },
  setup () {
    const instance = getCurrentInstance()
    const router = useRouter()

    const dialogMananger = new DialogManager(instance)

    const refreshTokenTimer = ref<number>(0)

    const myUsername = localStorage.getItem('username') || ''

    const state = reactive<HomeState>({
      rooms: [],
      onlineMembers: [],
      roomSelected: null,
      pendingRoomSelected: null,
      socketIOClient: null,
      messages: [],
      messageToSend: ''
    })

    const dialog = reactive<Dialog>({
      show: false,
      isAddRoom: false,
      isChangePrivateRoom: false
    })

    const pagination = reactive<Pagination>({
      limit: 5,
      skip: 0,
      moreAvailable: true,
      page: 1
    })

    const autoScroll = (el: HTMLElement | null) => {
      if (!el) return
      setTimeout(() => {
        el.scrollTop = el.scrollHeight
      }, 200)
    }

    const {
      getMessages,
      messageInfiniteScrolling,
      sendMessage
    } = MessageManager(
      () => state,
      pagination,
      dialogMananger,
      myUsername)

    const {
      showDialogChangeRoom,
      showDialogCreateRoom,
      acceptChangeRoom,
      changeRoom,
      acceptAddRoom,
      getAllRooms
    } = RoomManager(
      () => state,
      () => dialog,
      getMessages,
      dialogMananger)

    const {
      createSocketIOClient
    } = SocketManager(
      () => state,
      dialogMananger,
      changeRoom)

    const activeJwtTokenRefresh = () => {
      refreshTokenTimer.value = setInterval(async () => {
        const { error, message, value } = await refreshToken()
        if (error) {
          dialogMananger.showErrorMessage(message)
          return
        }
        updateToken(value)
      }, REFRESH_JWT_TIME * 60 * 1000)
    }

    const messagesScrolling = throttle(messageInfiniteScrolling, 500)

    onMounted(async () => {
      if (!myUsername) {
        clearToken()
        router.push({
          name: 'Login'
        })
      }
      activeJwtTokenRefresh()
      await getAllRooms()
      createSocketIOClient()
      await changeRoom(state.rooms[0])
    })

    watch(
      () => state.messages,
      () => {
        autoScroll(document.querySelector('#messagesList'))
      }
    )

    const logout = () => {
      clearToken()
      if (state.socketIOClient) {
        state.socketIOClient.disconnect()
      }
      router.push({
        name: 'Login'
      })
    }

    onBeforeUnmount(() => {
      clearInterval(refreshTokenTimer.value)
    })

    return {
      state,
      showDialogChangeRoom,
      sendMessage,
      myUsername,
      logout,
      showDialogCreateRoom,
      acceptAddRoom,
      dialog,
      acceptChangeRoom,
      messagesScrolling
    }
  }
})
</script>
