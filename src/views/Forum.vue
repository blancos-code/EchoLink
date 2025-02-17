<template>
  <div>
    <conversation-list v-model="drawer" title="Forums" :forums="forums" :selected-forum-id="selectedForum?.id"
      :userId="userId" isForum="true" @forum-selected="handleForumSelect" @create-chat="showCreateForumDialog = true"
      @create-thematique="showCreateThematiqueDialog = true" />
    <template v-if="selectedForum">
      <chat-window :selectedForum="selectedForum" :messageHistory="messages" :userId="userId" @back="handleBack" />
    </template>
    <v-container v-else class="d-flex align-center justify-center" fluid>
      <div class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
        <div class="text-h6 mt-4 text-grey">Select a Forum to start messaging</div>
      </div>
    </v-container>
  </div>


  <v-dialog v-model="showCreateForumDialog" persistent width="500">
    <create-forum-dialog @forum-created="handleForumCreated" @cancel="showCreateForumDialog = false" />
  </v-dialog>

  <v-dialog v-model="showCreateThematiqueDialog" persistent width="500">
    <create-thematique-dialog @thematique-created="handleForumCreated" @cancel="showCreateThematiqueDialog = false" />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import ForumService from '@/service/ForumService';
import ConversationList from "@/components/ConversationList.vue";
import ChatWindow from '@/components/ChatWindow.vue';
import CreateForumDialog from "@/components/CreateForumDialog.vue";
import CreateThematiqueDialog from "@/components/CreateThematiqueDialog.vue";
import socketClient from "@/utils/socket.js";
import UserService from "@/service/userService.js";

const userId = ref('');
const forums = ref([]);
const drawer = ref(true);
const selectedForum = ref(null);
const showCreateForumDialog = ref(false);
const showCreateThematiqueDialog = ref(false);
const messages = ref([]);
const activeForumId = ref(null);
const userNames = ref(new Map());

// Watch for selected forum changes
watch(selectedForum, (newForum, oldForum) => {
  if (oldForum?._id) {
    socketClient.socket?.emit('leave_forum', oldForum._id);
  }
  if (newForum?._id) {
    socketClient.socket?.emit('join_forum', newForum._id);
  }
});

//load messages for a forum
const loadMessages = async (forumId) => {
  try {
    messages.value = await ForumService.getForumMessages(forumId);
    // Fetch user names for each message
    messages.value = await Promise.all(messages.value.map(async (m) => {
      let userName;
      if (userNames.value.has(m.user)) {
        userName = userNames.value.get(m.user);
      } else {
        const userResponse = await UserService.getUserById(m.user);
        userName = `${userResponse.prenom} ${userResponse.nom}`;
        userNames.value.set(m.user, userName);
      }
      m.userName = userName;
      return m;
    }));
    activeForumId.value = forumId;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

const handleForumSelect = async (forum) => {
  selectedForum.value = forum;
  if (forum?._id) {
    await loadMessages(forum._id);
  }
};

const handleBack = () => {
  selectedForum.value = null;
  activeForumId.value = null;
  messages.value = [];
};

const setupSocketListeners = () => {
  socketClient.socket?.on('new_message', ({ forumId, message }) => {
    // Add message if it's for the current conversation
    if (forumId === activeForumId.value) {
      const messageExists = messages.value.some(m => m._id === message._id);
      if (!messageExists) {
        messages.value.push(message);
      }
    }

    // Update last message in forum list
    const forum = forums.value.find(f => f._id === forumId);
    if (forum) {
      forum.lastMessage = message;
    }
  });

  //todo warn user when a new forum is created

};

const initialize = async () => {
  try {
    forums.value = await ForumService.getAllForums();
  } catch (error) {
    console.error('Error loading forums:', error);
  }
};

onMounted(async () => {
  userId.value = JSON.parse(localStorage.getItem('userId'));
  await socketClient.connect();

  setupSocketListeners();

  await initialize();
});

const handleForumCreated = (newForum) => {
  forums.value.push(newForum);
  showCreateForumDialog.value = false;
};

onBeforeUnmount(() => {
  // Cleanup
  if (socketClient.socket) {
    socketClient.socket.off('new_message');
    socketClient.socket.off('new_conversation');
    socketClient.socket.off('user_typing');
    socketClient.socket.off('user_stop_typing');
    socketClient.socket.off('user_status_change');
  }
  socketClient.disconnect();
});


</script>