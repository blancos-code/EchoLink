<template>
  <conversation-list v-model="drawer" :chats="conversations" :selected-chat-id="selectedChat?.id"
    @chat-selected="handleChatSelect" @create-chat="showCreateChatForm = true" />

  <template v-if="selectedChat">
    <chat-window :selectedChat="selectedChat" :messageHistory="messages" :userId="userStore.userId"
      :typing-users="Array.from(typingUsers)" @typing="handleTyping" @back="handleBack" />
  </template>

  <v-container v-else class="d-flex align-center justify-center" fluid>
    <div class="text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
      <div class="text-h6 mt-4 text-grey">Select a conversation to start messaging</div>
    </div>
  </v-container>

  <CreateChatDialog v-model="showCreateChatForm" @chatCreated="addConversation" @cancelCreation="cancelCreation" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useUserStore } from '@/stores/user.js';
import ConversationList from '@/components/ConversationList.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import CreateChatDialog from '@/components/CreateChatDialog.vue';
import MessageService from '@/service/MessageService';
import socketClient from '@/utils/socket.js';

const userStore = useUserStore();
const conversations = ref([]);
const drawer = ref(true);
const selectedChat = ref(null);
const showCreateChatForm = ref(false);
const messages = ref([]);
const typingUsers = ref(new Set());
const activeConversationId = ref(null);

// Watch for selected chat changes
watch(selectedChat, (newChat, oldChat) => {
  if (oldChat?._id) {
    socketClient.socket?.emit('leave_conversation', oldChat._id);
  }
  if (newChat?._id) {
    socketClient.socket?.emit('join_conversation', newChat._id);
  }
});

// Load messages for a conversation
const loadMessages = async (conversationId) => {
  try {
    messages.value = await MessageService.getMessages(conversationId);
    activeConversationId.value = conversationId;
  } catch (error) {
    toast.error('Error loading messages');
    console.error('Error loading messages:', error);
  }
};

const handleChatSelect = async (chat) => {
  selectedChat.value = chat;
  if (chat?._id) {
    await loadMessages(chat._id);
  }
};

const handleBack = () => {
  selectedChat.value = null;
  activeConversationId.value = null;
  messages.value = [];
};

let typingTimeout;
const handleTyping = () => {
  if (!selectedChat.value) return;

  socketClient.socket?.emit('typing_start', selectedChat.value._id);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socketClient.socket?.emit('typing_end', selectedChat.value._id);
  }, 1000);
};

const addConversation = (newChat) => {
  const exists = conversations.value.some(chat =>
    chat.participants.length === newChat.participants.length &&
    chat.participants.every(p1 =>
      newChat.participants.some(p2 => p1._id === p2._id)
    )
  );

  if (!exists) {
    conversations.value.push(newChat);
    showCreateChatForm.value = false;
    selectedChat.value = newChat;
  } else {
    selectedChat.value = conversations.value.find(chat =>
      chat.participants.length === newChat.participants.length &&
      chat.participants.every(p1 =>
        newChat.participants.some(p2 => p1._id === p2._id)
      )
    );
  }
};

const cancelCreation = () => {
  showCreateChatForm.value = false;
};

const setupSocketListeners = () => {
  socketClient.socket?.on('new_message', ({ conversationId, message }) => {
    // Add message if it's for the current conversation
    if (conversationId === activeConversationId.value) {
      const messageExists = messages.value.some(m => m._id === message._id);
      if (!messageExists) {
        messages.value.push(message);
      }
    }

    // Update last message in conversation list
    const conversation = conversations.value.find(c => c._id === conversationId);
    if (conversation) {
      conversation.lastMessage = message;
    }
  });

  socketClient.socket?.on('new_conversation', (conversation) => {
    addConversation(conversation);
  });

  socketClient.socket?.on('user_typing', ({ userId, conversationId }) => {
    if (conversationId === selectedChat.value?._id) {
      typingUsers.value.add(userId);
    }
  });

  socketClient.socket?.on('user_stop_typing', ({ userId, conversationId }) => {
    if (conversationId === selectedChat.value?._id) {
      typingUsers.value.delete(userId);
    }
  });

  socketClient.socket?.on('user_status_change', ({ userId, status }) => {
    conversations.value.forEach(conv => {
      const participant = conv.participants.find(p => p._id === userId);
      if (participant) {
        participant.status = status;
      }
    });
  });
};

const initialize = async () => {
  try {
    conversations.value = await MessageService.getConversations(userStore.userId);
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
};

onMounted(async () => {
  await socketClient.connect();

  setupSocketListeners();

  await initialize();
});

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
  clearTimeout(typingTimeout);
});
</script>