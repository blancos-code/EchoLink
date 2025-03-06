<template>
    <v-container class="chat-container" fluid>
      <!-- Chat Header -->
      <v-app-bar flat color="white" class="chat-header">
        <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-avatar size="40" class="mx-2 clickable" onclick="console.log('coucou')">
          <v-img :src="selectedChat?.avatar ? selectedChat.avatar :'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png' " alt="User avatar"></v-img>
        </v-avatar>
        <div>
          <div class="font-weight-bold">{{ selectedChat != null ? selectedChat?.name : selectedForum != null ? selectedForum?.titre : ''}}</div>
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
        <v-card-text  class="messages-container">
          <template v-for="(message, index) in messageHistory" :key="index">
            <div :class="['message-wrapper', message.user === userId ? 'sent' : 'received']">
              <v-card :color="message.user === userId ? 'primary' : 'grey lighten-3'"
                      :class="['message-bubble', message.user === userId ? 'sent' : 'received']" rounded="lg">
                <v-card-text :class="['pa-2', message.user === userId ? 'white--text' : '']">
                  {{ message.text }}
                </v-card-text>
              </v-card>
              <div class="caption text-grey message-time">{{ (message.forum != null && message.user !== userId) ? `${ message.userName} - ` : '' }}{{formatDate(message.date)}} </div>
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
  
  <script>
  import "@/assets/css/components/chatWindow.css";
  import MessageService from "@/service/MessageService";
  import ForumService from "@/service/ForumService.js";
  import { formatDate } from "@/utils/date";
  export default {
    name: 'Chat',
    props: {
      selectedChat: Object,
      selectedForum: Object,
      messageHistory: Array,
      userId: String,
    },
    data: () => ({
      newMessage: '',
    }),
    methods: {
      formatDate,
      async sendMessage() {
        if (!this.newMessage.trim()) return;
        if(this.selectedChat != null){
          try {
            await MessageService.sendMessage({
              conversationId: this.selectedChat._id,
              text: this.newMessage
            });
            this.newMessage = '';
          } catch (error) {
            console.error('Erreur lors de l\'envoi du message dans la conversation:', error);
          }
        }
        if(this.selectedForum != null){
          try {
            await ForumService.sendMessage(
              this.selectedForum._id,
              this.newMessage
            )
  
            this.newMessage = '';
          } catch (error) {
            console.error('Erreur lors de l\'envoi du message dans le forum:', error);
          }
  
        }
      },
      goBack() {
        this.$emit('back');
      },
    },
  };
  </script>
  
  <style>
  .clickable{
    cursor: pointer;
  }
  </style>