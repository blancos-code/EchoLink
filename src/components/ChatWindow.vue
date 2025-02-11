<template>
  <v-container class="chat-container" fluid>
    <!-- Chat Header -->
    <v-app-bar flat color="white" class="chat-header">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-avatar size="40" class="mx-2">
        <v-img v-if="selectedChat != null" :src="selectedChat?.avatar" alt="User avatar"></v-img>
      </v-avatar>
      <div>
        <div v-if="selectedChat != null" class="font-weight-bold">{{ selectedChat?.name }}</div>
        <div v-if="selectedForum != null" class="font-weight-bold">{{ selectedForum?.titre }} - {{selectedForum?.zone_geographique}}</div>
        <div class="caption text-grey">Active now</div>
      </div>
      <v-spacer></v-spacer>
      <v-container v-if="selectedChat != null" fluid>
        <v-btn icon>
          <v-icon>mdi-phone</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-video</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-container>

    </v-app-bar>

    <!-- Chat Messages -->
    <v-card v-if="selectedChat != null" class="chat-content" flat>
      <v-card-text class="messages-container" ref="messagesContainer">
        <template v-for="(message, index) in selectedChat?.messages" :key="index">
          <div :class="['message-wrapper', message.isSent ? 'sent' : 'received']">
            <v-card :color="message.isSent ? 'primary' : 'grey lighten-3'"
              :class="['message-bubble', message.isSent ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.isSent ? 'white--text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ formatDate(message.createdAt) }}</div>
          </div>
        </template>
      </v-card-text>
    </v-card>
    <!-- Forum Messages -->
    <v-card v-if="selectedForum != null" class="chat-content" flat>
      <v-card-text class="messages-container" ref="messagesContainer">
        <template v-for="(message, index) in selectedForum?.messages" :key="index">
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
          <v-col v-if="selectedChat != null" cols="auto" class="mr-2">
            <v-btn icon>
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-text-field
              v-model="newMessage"
              placeholder="Message..."
              rounded
              filled
              dense
              hide-details
              auto-grow
              rows="1"
              variant="outlined"
            >
              <template v-slot:append>
                <v-btn v-if="!newMessage" icon class="ml-0">
                  <v-icon>mdi-microphone</v-icon>
                </v-btn>
                <v-btn v-else color="primary" icon @click="$emit('send-message', newMessage)" class="ml-0">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script setup>
import "@/assets/css/components/chatWindow.css";
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
  selectedChat: {
    type: Object,
    default: null,
  },
  selectedForum: {
    type: Object,
    default: null,
  }
});

const newMessage = ref('');

const scrollToBottom = () => {
  const container = document.querySelector('.messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>