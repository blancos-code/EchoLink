<template>
  <conversation-list v-model="drawer" :chats="chats" :selected-chat-id="selectedChat?.id"
    @chat-selected="handleChatSelect" @create-chat="showCreateChatForm = true"/>

  <template v-if="selectedChat">
    <chat-window :selectedChat="selectedChat" @send-message="handleSendMessage" @back="handleBack"/>
  </template>
  <v-container v-else class="d-flex align-center justify-center" fluid>
    <div class="text-center">
      <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
      <div class="text-h6 mt-4 text-grey">Select a conversation to start messaging</div>
    </div>
  </v-container>

  <v-dialog v-model="showCreateChatForm" max-width="400px">
        <v-card>
          <v-card-title>Create a new chat</v-card-title>
          <v-card-text>
            <v-text-field v-model="newChatName" label="Chat Name" required></v-text-field>
            <v-text-field v-model="newChatAvatar" label="Avatar URL" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="showCreateChatForm = false">Cancel</v-btn>
            <v-btn color="primary" @click="createChat">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

</template>

<script>
import ConversationList from '../components/ConversationList.vue'
import ChatWindow from '../components/ChatWindow.vue'

export default {
  components: {
    ConversationList,
    ChatWindow
  },
  data() {
    return {
      drawer: true,
      selectedChat: null,
      chats: [
        {
          id: 1,
          name: 'John Doe',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          lastMessage: 'Hey, how are you?',
          time: '2:30 PM',
          messages: [
            {
              text: 'Hey, how are you?',
              time: '2:30 PM',
              isSent: false,
            },
            {
              text: 'I\'m good, thanks! How about you?',
              time: '2:31 PM',
              isSent: true,
            },
            {
              text: 'Just working on some new projects',
              time: '2:31 PM',
              isSent: true,
            },
            {
              text: 'That sounds interesting! Can you tell me more?',
              time: '2:32 PM',
              isSent: false,
            },
          ]
        },
        {
          id: 2,
          name: 'Jane Smith',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          lastMessage: 'The meeting is at 3 PM',
          time: '1:45 PM',
          messages: [
            {
              text: 'Hi Jane, are we still meeting tomorrow?',
              time: '1:40 PM',
              isSent: true,
            },
            {
              text: 'Yes, 2 PM works for me',
              time: '1:42 PM',
              isSent: false,
            },
            {
              text: 'Perfect, looking forward to it',
              time: '1:43 PM',
              isSent: true,
            },
            {
              text: 'The meeting is at 3 PM',
              time: '1:45 PM',
              isSent: false,
            },
          ]
        }
      ],
      showCreateChatForm: false,
      newChatName: '',
      newChatAvatar: ''
    }
  },

  methods: {
    handleChatSelect(chat) {
      this.selectedChat = chat
    },
    handleBack(){
      this.selectedChat = null
    },
    handleSendMessage(message) {
      if (!this.selectedChat) return

      // Add message to chat messages
      this.selectedChat.messages.push({
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
      })

      // Update last message in chat list
      this.selectedChat.lastMessage = message
      this.selectedChat.time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    createChat() {
      if (!this.newChatName || !this.newChatAvatar) {
        // Make sure we have both name and avatar
        return alert('Please provide both a name and an avatar URL')
      }
      // Generate a unique ID for the new chat (could be dynamic if needed)
      const newChatId = this.chats.length + 1;
      // Add the new chat to the chats array
      this.chats.push({
        id: newChatId,
        name: this.newChatName,
        avatar: this.newChatAvatar,
        lastMessage: '',
        time: '',
        messages: []
      });
      // Reset the form
      this.newChatName = '';
      this.newChatAvatar = '';
      this.showCreateChatForm = false;
    }
  }
}
</script>
