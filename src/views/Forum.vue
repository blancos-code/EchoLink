<template>
  <div>
<conversation-list v-model="drawer" title="Forums" :forums="forums" :selected-forum-id="selectedForum?.id" @forum-selected="handleForumSelect" @create-chat="showCreateForumDialog = true"/>
    <template v-if="selectedForum">
      <chat-window :selectedForum="selectedForum" @send-message="handleSendMessage" @back="handleBack" />
    </template>
    <v-container v-else class="d-flex align-center justify-center" fluid>
      <div class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
        <div class="text-h6 mt-4 text-grey">Select a Forum to start messaging</div>
      </div>
    </v-container>
  </div>


  <v-dialog
      v-model="showCreateForumDialog"
      persistent
      width="500"
  >
    <create-forum-dialog @forum-created="handleForumCreated" @cancel="showCreateForumDialog = false" />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ForumService from '@/service/ForumService';
import ConversationList from "@/components/ConversationList.vue";
import ChatWindow from '@/components/ChatWindow.vue';
import CreateForumDialog from "@/components/CreateForumDialog.vue";
const drawer = ref(true);
const forums = ref([]);
const selectedForum = ref(null);
const showCreateForumDialog = ref(false);
const newMessageText = ref('');

onMounted(async () => {
  forums.value = await ForumService.getAllForums();
});

const handleForumSelect = async (forum) => {
  selectedForum.value = forum;
};

const handleBack = () => {
  selectedForum.value = null;
  ForumService.joinForum(); //leave ws forum room
};

const handleSendMessage = (newMessage) => {
  console.log("handle send message", newMessage);
  if(newMessage !== '' && selectedForum.value){
    ForumService.postMessage(selectedForum.value.id,newMessage);
    newMessageText.value = '';
  }
};

const handleForumCreated = (newForum) => {
  forums.value.push(newForum);
  showCreateForumDialog.value = false;
};


</script>