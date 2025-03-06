<template>
  <div>
    <forum-list
  ref="forumList"
  v-model="drawer"
  title="Forums"
  :forums="forums"
  :selected-forum-id="selectedForum?.id"
  :userId="userId"
  isForum="true"
  @forum-selected="handleForumSelect"
  @create-forum="showCreateForumDialog = true"
/>
    <template v-if="selectedForum">
      <forum-window :selectedForum="selectedForum" :messageHistory="messages" :userId="userId" @back="handleBack" />
    </template>
    <v-container v-else class="d-flex align-center justify-center" fluid>
      <div class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
        <div class="text-h6 mt-4 text-grey">Select a Forum to start messaging</div>
      </div>
    </v-container>

    <v-dialog v-model="showCreateForumDialog" persistent width="500">
      <create-forum-dialog @forum-created="handleForumCreated" @cancel="showCreateForumDialog = false" />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import ForumService from '@/service/ForumService'
import ForumList from '@/components/ForumList.vue'
import ForumWindow from '@/components/ForumWindow.vue'
import CreateForumDialog from '@/components/CreateForumDialog.vue'
import socketClient from '@/utils/socket.js'
import UserService from '@/service/userService.js'

const userId = ref('')
const forums = ref([])
const drawer = ref(true)
const selectedForum = ref(null)
const showCreateForumDialog = ref(false)
const messages = ref([])
const activeForumId = ref(null)
const userNames = ref(new Map())
const forumList = ref(null)

// Watch for selected forum changes
watch(selectedForum, (newForum, oldForum) => {
  if (oldForum?._id) {
    socketClient.socket?.emit('leave_forum', oldForum._id)
  }
  if (newForum?._id) {
    socketClient.socket?.emit('join_forum', newForum._id)
  }
})

// Load messages for a forum
const loadMessages = async (forumId) => {
  try {
    messages.value = await ForumService.getForumMessages(forumId)
    messages.value = await Promise.all(
      messages.value.map(async (m) => {
        let userName
        if (userNames.value.has(m.user)) {
          userName = userNames.value.get(m.user)
        } else {
          const userResponse = await UserService.getUserById(m.user)
          userName = `${userResponse.prenom} ${userResponse.nom}`
          userNames.value.set(m.user, userName)
        }
        m.userName = userName
        return m
      })
    )
    activeForumId.value = forumId
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const handleForumSelect = async (forum) => {
  selectedForum.value = forum
  if (forum?._id) {
    await loadMessages(forum._id)
  }
}

const handleBack = () => {
  selectedForum.value = null
  activeForumId.value = null
  messages.value = []
}

const setupSocketListeners = () => {
  socketClient.socket?.on('new_message', ({ forumId, message }) => {
    if (forumId === activeForumId.value) {
      const messageExists = messages.value.some(m => m._id === message._id)
      if (!messageExists) {
        messages.value.push(message)
      }
    }
    const forum = forums.value.find(f => f._id === forumId)
    if (forum) {
      forum.lastMessage = message
    }
  })
}

const initialize = async () => {
  try {
    forums.value = await ForumService.getAllForums()
  } catch (error) {
    console.error('Error loading forums:', error)
  }
}

const handleForumCreated = (newForum) => {
  forums.value.push(newForum)
  showCreateForumDialog.value = false
}

onMounted(async () => {
  userId.value = JSON.parse(localStorage.getItem('userId'))
  await socketClient.connect()
  setupSocketListeners()
  await initialize()
})

onBeforeUnmount(() => {
  if (socketClient.socket) {
    socketClient.socket.off('new_message')
    socketClient.socket.off('new_conversation')
    socketClient.socket.off('user_typing')
    socketClient.socket.off('user_stop_typing')
    socketClient.socket.off('user_status_change')
  }
  socketClient.disconnect()
})
</script>