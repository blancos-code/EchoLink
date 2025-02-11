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
        <template v-for="(message, index) in messageHistory" :key="index">
          <div :class="['message-wrapper', message.sender == userId ? 'sent' : 'received']">
            <v-card :color="message.sender == userId ? 'primary' : 'grey lighten-3'"
              :class="['message-bubble', message.sender == userId ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.sender == userId ? 'white--text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ formatDate(message.createdAt) }}</div>
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

<script setup>
import { formatDate } from "../utils/date";

</script>

<script>
import "@/assets/css/components/chatWindow.css";
import MessageService from "../service/MessageService";

export default {
  name: 'InstagramChat',
  props: {
    selectedChat: Object,
    messageHistory: Array,
    userId: String,
  },
  data: () => ({
    newMessage: '',
  }),
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChat) return;

      try {
        const newSavedMessage = await MessageService.sendMessage({
          conversationId: this.selectedChat._id,
          text: this.newMessage
        });

        this.messageHistory.push(newSavedMessage);

        // emit('chatCreated', newChat);
        // emit('update:modelValue', false);
      } catch (error) {
        console.error('Erreur lors de l\'envoie du message:', error);
      }


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