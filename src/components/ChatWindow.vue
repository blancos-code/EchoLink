<template>
  <v-container class="chat-container" fluid>
    <!-- Chat Header -->
    <v-app-bar flat color="white" class="chat-header">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-avatar size="40" class="mx-2">
        <v-img :src="selectedChat?.avatar" alt="User avatar"></v-img>
      </v-avatar>
      <div>
        <div class="font-weight-bold">{{ selectedChat?.name }}</div>
        <div class="caption text-grey">Active now</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-phone</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-video</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Chat Messages -->
    <v-card class="chat-content" flat>
      <v-card-text class="messages-container" ref="messagesContainer">
        <template v-for="(message, index) in selectedChat?.messages" :key="index">
          <div :class="['message-wrapper', message.isSent ? 'sent' : 'received']">
            <v-card :color="message.isSent ? 'primary' : 'grey lighten-3'"
              :class="['message-bubble', message.isSent ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.isSent ? 'white--text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ message.time }}</div>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <!-- Message Input -->
    <v-footer app color="white" class="chat-footer">
      <v-card flat width="100%" color="transparent">
        <v-row no-gutters align="center">
          <v-col cols="auto" class="mr-2">
            <v-btn icon>
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <!-- Replacing v-text-field with v-textarea -->
            <v-textarea
              v-model="newMessage"
              placeholder="Message..."
              rounded
              filled
              dense
              hide-details
              @keypress.enter="sendMessage"
              auto-grow
              rows="1"
              variant="outlined"
              
            >
              <template v-slot:append-outer>
                <v-btn v-if="!newMessage" icon class="ml-0">
                  <v-icon>mdi-microphone</v-icon>
                </v-btn>
                <v-btn v-else color="primary" icon @click="sendMessage" class="ml-0">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: 'InstagramChat',
  props: {
    selectedChat: Object,
  },
  data: () => ({
    newMessage: '',
  }),
  methods: {
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChat) return;

      this.selectedChat.messages.push({
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
      });

      this.newMessage = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    goBack() {
      this.$emit('back');
    },
  },
  mounted() {
    this.scrollToBottom();
  },
};
</script>

<style scoped>
.chat-container {
  height: 80vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: static;
}

.chat-header {
  border-bottom: 1px solid #e0e0e0;
}

.chat-content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: white;
}

.messages-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-wrapper.sent {
  align-self: flex-end;
  align-items: flex-end;
}

.message-wrapper.received {
  align-self: flex-start;
  align-items: flex-start;
}

.message-bubble {
  margin-bottom: 2px;
}

.message-bubble.sent {
  border-bottom-right-radius: 4px !important;
}

.message-bubble.received {
  border-bottom-left-radius: 4px !important;
}

.message-time {
  font-size: 0.75rem;
}

.chat-footer {
  border-top: 1px solid #e0e0e0;
  padding: 8px 16px;
}

.v-textarea {
  max-height: 20vh;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
}

.v-textarea__control {
  border: none;
}

.v-textarea__input {
  padding: 8px;
}
</style>
