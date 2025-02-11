<!--
<template>
  <v-container class="chat-container" fluid>
    &lt;!&ndash; Chat Header &ndash;&gt;
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

    &lt;!&ndash; Chat Messages &ndash;&gt;
    <v-card v-if="selectedChat != null" class="chat-content" flat>
      <v-card-text class="messages-container" ref="messagesContainer">
        <template v-for="(message, index) in selectedChat?.messages" :key="index">
          <div :class="['message-wrapper', message.isSent ? 'sent' : 'received']">
            <v-card :color="message.isSent ? 'primary' : 'grey lighten-3'"
              :class="['message-bubble', message.isSent ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.isSent ? 'white&#45;&#45;text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ formatDate(message.createdAt) }}</div>
          </div>
        </template>
      </v-card-text>
    </v-card>
    &lt;!&ndash; Forum Messages &ndash;&gt;
    <v-card v-if="selectedForum != null" class="chat-content" flat>
      <v-card-text class="messages-container" ref="messagesContainer">
        <template v-for="(message, index) in forumMessages" :key="index">
          <div :class="['message-wrapper', message.isSent ? 'sent' : 'received']">
            <v-card :color="message.isSent ? 'primary' : 'grey lighten-3'"
                    :class="['message-bubble', message.isSent ? 'sent' : 'received']" rounded="lg">
              <v-card-text :class="['pa-2', message.isSent ? 'white&#45;&#45;text' : '']">
                {{ message.text }}
              </v-card-text>
            </v-card>
            <div class="caption text-grey message-time">{{ message.time }}</div>
          </div>
        </template>
      </v-card-text>
    </v-card>

    &lt;!&ndash; Message Input &ndash;&gt;
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
import {ref, onMounted, defineProps, onUpdated} from 'vue';
import ForumService from "@/service/ForumService.js";
import AuthService from "@/service/AuthService.js";

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
const forumMessages = ref([]);

const scrollToBottom = () => {
  const container = document.querySelector('.messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const fetchMessages = async () => {
  if (props.selectedForum != null) {
    console.log("selectedForum", props.selectedForum);
    forumMessages.value = await ForumService.getForumMessages(props.selectedForum._id);
  }
};

ForumService.on('newMessage', (message) => {
  forumMessages.value.push(message);
  scrollToBottom();
});


const connectUser = () => {
  if(props.selectedForum != null){
    const token = localStorage.getItem('token');
    ForumService.connect(token);
    ForumService.joinForum(props.selectedForum._id); //join ws forum room
    fetchMessages();
  }
  scrollToBottom();
}

onUpdated(() =>{
  ForumService.leaveForum();
  connectUser();
})
onMounted(() => {
  connectUser();
});
</script>-->


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
            <v-textarea v-model="newMessage" placeholder="Message..." rounded filled dense hide-details
                         auto-grow rows="1" variant="outlined">
              <template v-slot:append>
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
        await MessageService.sendMessage({
          conversationId: this.selectedChat._id,
          text: this.newMessage
        });

      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
      this.newMessage = '';
    },
    goBack() {
      this.$emit('back');
    },
  },
};
</script>