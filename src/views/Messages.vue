<template>
  <conversation-list v-model="drawer" :chats="conversations" :selected-chat-id="selectedChat?.id"
    @chat-selected="handleChatSelect" @create-chat="showCreateChatForm = true" />

  <template v-if="selectedChat">
    <chat-window :selectedChat="selectedChat" @send-message="handleSendMessage" @back="handleBack" />
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
import { watch } from 'vue';
import { ref, onMounted, reactive } from 'vue';
import ConversationList from '../components/ConversationList.vue';
import ChatWindow from '../components/ChatWindow.vue';
import CreateChatDialog from '../components/CreateChatDialog.vue';
import MessageService from '../service/MessageService';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();

const user = ref(JSON.parse(localStorage.getItem('user')));
const conversations = ref([]);
const drawer = ref(true);
const selectedChat = ref(null);
const showCreateChatForm = ref(false);
const recipientId = ref(null);
const newMessage = ref("");
const activeConversationId = ref(null);
const messages = ref([]);

const handleChatSelect = (chat) => {
  selectedChat.value = chat;
};

const handleBack = () => {
  selectedChat.value = null;
};

const loadMessages = async (conversationId) => {
  messages.value = await MessageService.getMessages(conversationId);
  activeConversationId.value = conversationId;
};

const handleSendMessage = (message) => {
  MessageService.sendMessage(user.value.id, recipientId.value, message);
  newMessage.value = "";
};

const addConversation = (newChat) => {
  conversations.value.push(newChat);
  showCreateChatForm.value = false;
};

const cancelCreation = () => {
  showCreateChatForm.value = false;
}


onMounted(async () => {
  MessageService.connect(userStore.userId);

  conversations.value = await MessageService.getConversations(userStore.userId);

  MessageService.on('private_message', (message) => {
    if (message.conversationId === activeConversationId.value) {
      messages.value.push({
        sender: message.sender,
        text: message.text
      });
    }
  });
});
</script>
