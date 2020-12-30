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
            class="btn btn-secondary btn-medium"
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
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

import {
  getRooms,
  refreshToken,
  getRoomMessages,
  createNewRoom,
  accedRoom
} from '@/services/api.service'
import { updateToken, getToken, clearToken } from '@/services/token.service'

import { REFRESH_JWT_TIME, SOCKET_IO_URL } from '@/config'

import DialogManager from '@/classes/DialogManager'
import SocketError from '@/classes/SocketError'

import SocketIOEventName from '@/enums/SocketIOEventName'
import SocketIOErrorName from '@/enums/SocketIOErrorName'

import MessageCard from '@/components/MessageCard.vue'
import AddRoom from '@/components/Dialogs/AddRoom.vue'
import ChangePrivateRoom from '@/components/Dialogs/ChangePrivateRoom.vue'

import Message from '@/interfaces/Message'
import MemberOnline from '@/interfaces/MemberOnline'
import AddRoomResult from '@/interfaces/DialogResult/AddRoom'
import ChangePrivateRoomResult from '@/interfaces/DialogResult/ChangePrivateRoom'
import HomeState from '@/interfaces/State/HomeState'
import Pagination from '@/interfaces/Pagination'
import Dialog from '@/interfaces/Dialog'
import Room from '@/interfaces/Room'

import { throttle } from '@/utils/scrolling'

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

    const getMessages = async () => {
      if (!state.roomSelected) return
      const { error, message, value } = await getRoomMessages(
        state.roomSelected.name,
        pagination.skip,
        pagination.limit
      )
      if (error) {
        dialogMananger.showErrorMessage(message)
        return
      }
      state.messages = [...state.messages, ...value.messages]
      pagination.moreAvailable = value.moreAvailable
    }

    const getAllRooms = async () => {
      try {
        const { error, message, value } = await getRooms()
        if (error) {
          dialogMananger.showErrorMessage(message)
          return
        }
        state.rooms = value
      } catch (error) {
        dialogMananger.showErrorMessage(error.message)
      }
    }

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

    const changeRoom = async (room: Room) => {
      if (!state.socketIOClient) {
        return
      }
      state.messages = []
      state.roomSelected = room
      await getMessages()

      state.socketIOClient.emit(
        SocketIOEventName.ChangeRoom,
        state.roomSelected.name
      )
    }

    const handleSocketIOError = (socketError: SocketError) => {
      dialogMananger.showErrorMessage(socketError.Message, socketError.Errorname)
      if (socketError.Errorname === SocketIOErrorName.Unauthorized) {
        changeRoom(state.rooms[0])
      }
    }

    const setSocketIOEventHandler = () => {
      if (!state.socketIOClient) return

      state.socketIOClient.on(SocketIOEventName.MessageRoom, (msg: Message) => {
        state.messages = [...state.messages, msg]
      })
      state.socketIOClient.on(
        SocketIOEventName.OnlineMembers,
        (members: MemberOnline[]) => {
          state.onlineMembers = members
        }
      )
      state.socketIOClient.on(
        SocketIOEventName.UserJoinRoom,
        (member: MemberOnline) => {
          const m = state.onlineMembers.find(
            (x) => x.username === member.username
          )
          if (m) {
            m.room = member.room
          } else {
            state.onlineMembers = [...state.onlineMembers, member]
          }
        }
      )
      state.socketIOClient.on(
        SocketIOEventName.UserConnected,
        (member: MemberOnline) => {
          state.onlineMembers = [...state.onlineMembers, member]
        }
      )
      state.socketIOClient.on(
        SocketIOEventName.UserDisconnected,
        (member: MemberOnline) => {
          state.onlineMembers = state.onlineMembers.filter(
            (x) => x.username !== member.username
          )
        }
      )
      state.socketIOClient.on(SocketIOEventName.CreateRoom, (room: Room) => {
        state.rooms = [...state.rooms, room]
      })
      state.socketIOClient.on(SocketIOEventName.Error, (socketError: SocketError) => {
        handleSocketIOError(socketError)
      })
    }

    const createSocketIOClient = () => {
      if (!state.socketIOClient) {
        state.socketIOClient = io(SOCKET_IO_URL, {
          autoConnect: true,
          reconnectionDelay: 2000,
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: 'Bearer ' + getToken()
              }
            }
          }
        })
      }
      setSocketIOEventHandler()
      if (state.socketIOClient.disconnected) {
        state.socketIOClient.connect()
      }
    }

    const acceptChangeRoom = async ({
      value,
      password
    }: ChangePrivateRoomResult) => {
      dialog.show = false
      if (value && state.socketIOClient && state.pendingRoomSelected) {
        const processAccedRoom = await accedRoom(state.pendingRoomSelected.name, password, state.socketIOClient.id)
        if (processAccedRoom.error) {
          dialogMananger.showErrorMessage(processAccedRoom.message)
          return
        }

        changeRoom(state.pendingRoomSelected)
      }
    }

    const showDialogChangeRoom = (room: Room) => {
      if (room.isPrivate) {
        state.pendingRoomSelected = room
        dialog.show = true
        dialog.isAddRoom = false
        dialog.isChangePrivateRoom = true
        return
      }
      changeRoom(room)
    }

    const sendMessage = () => {
      if (!state.socketIOClient) {
        return
      }
      state.socketIOClient.emit(
        SocketIOEventName.MessageRoom,
        state.messageToSend
      )
      const newMsg = {
        text: state.messageToSend,
        sendAt: new Date().toISOString(),
        owner: myUsername
      }
      state.messages = [...state.messages, newMsg]
    }

    const loadMore = async () => {
      pagination.page += 1
      pagination.skip =
        pagination.limit * pagination.page -
        pagination.limit
      await getMessages()
    }

    const messageInfiniteScrolling = async () => {
      const element = document.querySelector('#messagesList')
      if (element && element.scrollTop === 0 && pagination.moreAvailable) {
        try {
          await loadMore()
          element.scroll({
            top: 95 * 4,
            left: 0,
            behavior: 'smooth'
          })
        } catch (error) {
          dialogMananger.showErrorMessage(error.message)
        }
      }
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

    const showDialogCreateRoom = () => {
      dialog.show = true
      dialog.isAddRoom = true
      dialog.isChangePrivateRoom = false
    }

    const acceptAddRoom = async ({
      value,
      name,
      isPrivate,
      password
    }: AddRoomResult) => {
      dialog.show = false

      if (value && state.socketIOClient) {
        const processAddNewRoom = await createNewRoom(
          name,
          isPrivate,
          password
        )
        if (processAddNewRoom.error) {
          dialogMananger.showErrorMessage(processAddNewRoom.message)
          return
        }

        state.socketIOClient.emit(SocketIOEventName.CreateRoom, processAddNewRoom.value)
      }
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
