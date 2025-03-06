<template>
  <conversation-list
    v-model="drawer"
    :chats="conversations"
    :selected-chat-id="selectedChat?.id"
    @chat-selected="handleChatSelect"
    @create-chat="showCreateChatForm = true"
  />

  <template v-if="selectedChat">
    <chat-window
      :selected-chat="selectedChat"
      :message-history="messages"
      :user-id="userStore.userId"
      :typing-users="Array.from(typingUsers)"
      @typing="handleTyping"
      @back="handleBack"
      @send-message="handleSendMessage"
    />
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
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
import ConversationList from '@/components/ConversationList.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import CreateChatDialog from '@/components/CreateChatDialog.vue';
import MessageService from '@/service/MessageService';
import socketClient from '@/utils/socket.js';
import userService from '../service/userService';
import axios from 'axios';

const userStore = useUserStore();
const route = useRoute();
const conversations = ref([]);
const drawer = ref(true);
const selectedChat = ref(null);
const showCreateChatForm = ref(false);
const messages = ref([]);
const typingUsers = ref(new Set());
const activeConversationId = ref(null);

// Clé API Hugging Face
const HUGGINGFACE_API_KEY = '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';

watch(selectedChat, (newChat, oldChat) => {
  if (oldChat?._id) {
    socketClient.socket?.emit('leave_conversation', oldChat._id);
  }
  if (newChat?._id && newChat.id !== 'ai-assistant') {
    socketClient.socket?.emit('join_conversation', newChat._id);
  }
});

const loadMessages = async (conversationId) => {
  try {
    messages.value = await MessageService.getMessages(conversationId);
    activeConversationId.value = conversationId;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

const handleChatSelect = async (chat) => {
  messages.value = [];
  selectedChat.value = chat;

  if (chat.id === 'ai-assistant') {
    // Initialiser la conversation avec l'IA
    messages.value = [
      {
        _id: 'ai-initial',
        text: 'Bonjour ! Je suis ton assistant IA. Comment puis-je t’aider ?',
        user: 'ai',
        date: new Date(),
      },
    ];
    activeConversationId.value = 'ai-assistant';
  } else if (chat?._id) {
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
  if (!selectedChat.value || selectedChat.value.id === 'ai-assistant') return;

  socketClient.socket?.emit('typing_start', selectedChat.value._id);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socketClient.socket?.emit('typing_end', selectedChat.value._id);
  }, 1000);
};

const handleSendMessage = async (messageText) => {
  if (!selectedChat.value || !messageText.trim()) return;

  const newMessage = {
    conversationId: selectedChat.value._id || 'ai-assistant',
    text: messageText,
    user: userStore.userId,
    date: new Date(),
  };

  if (selectedChat.value.id === 'ai-assistant') {
    // Ajouter le message de l'utilisateur
    messages.value.push(newMessage);

    // Appeler l'API Hugging Face pour la réponse de l'IA
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2',
        {
          inputs: messageText,
          parameters: { max_length: 100 },
        },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data[0]?.generated_text || 'Je suis une IA et je réponds à ton message !';
      messages.value.push({
        _id: `ai-${Date.now()}`,
        text: aiResponse,
        userId: 'ai',
        date: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors de l’appel à l’API IA:', error);
      messages.value.push({
        _id: `ai-error-${Date.now()}`,
        text: 'Désolé, une erreur s’est produite. Réessayez plus tard.',
        userId: 'ai',
        date: new Date(),
      });
    }
  } else {
    // Conversation normale
    await MessageService.sendMessage(newMessage);
    socketClient.socket?.emit('new_message', newMessage);
  }
};

const addConversation = (newChat) => {
  const exists = conversations.value.some(chat =>
    chat.participants.length === newChat.participants.length &&
    chat.participants.every(p1 => newChat.participants.some(p2 => p1._id === p2._id))
  );

  if (!exists) {
    conversations.value.push(newChat);
    showCreateChatForm.value = false;
    selectedChat.value = newChat;
    if (newChat._id) {
      loadMessages(newChat._id);
    }
  } else {
    const existingChat = conversations.value.find(chat =>
      chat.participants.length === newChat.participants.length &&
      chat.participants.every(p1 => newChat.participants.some(p2 => p1._id === p2._id))
    );
    selectedChat.value = existingChat;
    loadMessages(existingChat._id);
  }
};

const cancelCreation = () => {
  showCreateChatForm.value = false;
};

const processHelpRequest = async (targetUserId) => {
  console.log('Traitement de la demande d\'aide pour userId:', targetUserId);

  const existingChat = conversations.value.find(chat =>
    chat.participants.some(p => p._id === targetUserId)
  );

  if (existingChat) {
    console.log('Conversation existante trouvée:', existingChat._id);
    selectedChat.value = existingChat;
    await loadMessages(existingChat._id);
  } else {
    console.log('Création d\'une nouvelle conversation pour:', targetUserId);
    const userData = await userService.getUserById(targetUserId);
    console.log("userData: " + JSON.stringify(userData));

    const newChat = await MessageService.createConversation({
      name: userData.nom + " " + userData.prenom,
      participantId: targetUserId,
    });
    addConversation(newChat);
  }
};

const checkQueryForHelpRequest = async () => {
  const targetUserId = route.query.c;
  if (targetUserId) {
    console.log('UserId détecté dans la query (c):', targetUserId);
    await processHelpRequest(targetUserId);
  } else {
    console.log('Aucun userId dans la query');
  }
};

const setupSocketListeners = () => {
  console.log('Configuration des écouteurs WebSocket');
  socketClient.socket?.on('new_message', ({ conversationId, message }) => {
    if (conversationId === activeConversationId.value && conversationId !== 'ai-assistant') {
      const messageExists = messages.value.some(m => m._id === message._id);
      if (!messageExists) {
        messages.value.push(message);
      }
    }
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
    console.log('Initialisation des conversations pour userId:', userStore.userId);
    conversations.value = await MessageService.getConversations(userStore.userId);
    console.log('Conversations chargées:', conversations.value.length);
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
};

onMounted(async () => {
  console.log('Page de conversation montée');
  await socketClient.connect();
  setupSocketListeners();
  await initialize();
  await checkQueryForHelpRequest();
});

onBeforeUnmount(() => {
  console.log('Page de conversation démontée');
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