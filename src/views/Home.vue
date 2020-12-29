<template>
  <div v-show="state.showAddRoomDialog" class="dialog-backdrop"></div>
  <div v-show="state.showAddRoomDialog" class=" dialog-container ">
    <AddRoom @accept="acceptAddRoom"/>
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
                  @click.prevent="changeRoom(room)"
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
            <div class="direct-chat-messages-list" id="messagesList">
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
  watch
} from 'vue'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

import {
  getRooms,
  refreshToken,
  getRoomMessages,
  createNewRoom
} from '@/services/api.service'
import { updateToken, getToken, clearToken } from '@/services/token.service'

import { REFRESH_JWT_TIME, SOCKET_IO_URL } from '@/config'
import DialogManager from '@/classes/DialogManager'

import SocketIOEventName from '@/enums/SocketIOEventName'

import MessageCard from '@/components/MessageCard.vue'
import AddRoom from '@/components/Dialogs/AddRoom.vue'

import Message from '@/interfaces/Message'
import MemberOnline from '@/interfaces/MemberOnline'
import AddRoomResult from '@/interfaces/DialogResult/AddRoom'
import HomeState from '@/interfaces/HomeState'
import Pagination from '@/interfaces/Pagination'
import Room from '@/interfaces/Room'

export default defineComponent({
  name: 'Home',
  components: { MessageCard, AddRoom },
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
      socketIOClient: null,
      messages: [],
      messageToSend: '',
      showAddRoomDialog: false
    })

    const pagination = reactive<Pagination>({
      limit: 10,
      skip: 0,
      moreAvailable: true
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
      state.messages = value.messages
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
        console.log(error)
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

    const changeRoom = async (room: Room) => {
      if (!state.socketIOClient) {
        return
      }
      state.roomSelected = room
      await getMessages()

      state.socketIOClient.emit(
        SocketIOEventName.ChangeRoom,
        state.roomSelected.name
      )
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
      state.showAddRoomDialog = true
    }

    const acceptAddRoom = async ({ value, name, isPrivate, password }: AddRoomResult) => {
      state.showAddRoomDialog = false
      if (value) {
        const processAddNewRoom = await createNewRoom(name, isPrivate, password)
      }
    }

    return {
      state,
      changeRoom,
      sendMessage,
      myUsername,
      logout,
      showDialogCreateRoom,
      acceptAddRoom
    }
  }
})
</script>
