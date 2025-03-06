<template>
  <v-container class="chat-container" fluid>
    <!-- Chat Header -->
    <v-app-bar flat color="white" class="chat-header">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-avatar size="40" class="mx-2 clickable" @click="goToProfile">
        <v-img 
          :src="selectedChat?.avatar ? selectedChat.avatar : 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'" 
          alt="User avatar"
        />
      </v-avatar>
      <div>
        <div class="font-weight-bold">{{ selectedChat?.name || 'Assistant IA' }}</div>
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
    <v-card class="chat-content" flat ref="messagesContainer">
      <v-card-text class="messages-container">
        <template v-for="(message, index) in messageHistory" :key="index">
          <div :class="['message-wrapper', message.user === userId ? 'sent' : 'received']">
            <v-card :color="message.user === userId ? 'primary' : 'grey lighten-3'"
                    :class="['message-bubble', message.user === userId ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.user === userId ? 'white--text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ formatDate(message.date) }}</div>
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
            <v-textarea v-model="newMessage" placeholder="Message..." rounded filled dense hide-details
                        auto-grow rows="1" variant="outlined" @keyup.enter="sendMessage">
              <template v-slot:append>
                <v-btn color="primary" icon @click="sendMessage" class="ml-0">
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
import "@/assets/css/components/chatWindow.css";
import { formatDate } from "@/utils/date";
import { useRouter } from 'vue-router';

export default {
  name: 'Chat',
  props: {
    selectedChat: Object,
    messageHistory: Array,
    userId: String,
  },
  data: () => ({
    newMessage: '',
  }),
  setup(props) {
    const router = useRouter();

    const goToProfile = () => {
      if (props.selectedChat?.id !== 'ai-assistant') {
        const participants = props.selectedChat.participants;
        let otherUserId = participants[0]._id === props.userId ? participants[1] : participants[0];
        if (otherUserId && otherUserId._id !== 'ai') {
          router.push(`/profile/${otherUserId._id}`);
        }
      }
    };

    return { goToProfile };
  },
  methods: {
    formatDate,
    sendMessage() {
      if (!this.newMessage.trim()) return;
      this.$emit('send-message', this.newMessage);
      this.newMessage = '';
    },
    goBack() {
      this.$emit('back');
    },
  },
};
</script>

<style>
.clickable {
  cursor: pointer;
}
</style>