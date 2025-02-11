<template>
  <div>
    <v-dialog
        v-model="showCreateForumDialog"
        persistent
        width="500"
    >
      <create-forum-dialog @forum-created="handleForumCreated" @cancel="showCreateForumDialog = false" />
    </v-dialog>
    <v-dialog v-model="showCreateThematiqueDialog" persistent width="500">
      <create-thematique-dialog @thematique-created="handleThematiqueCreated" @cancel="showCreateThematiqueDialog = false" />
    </v-dialog>
    <div class="mb-2">
      <v-btn @click="showCreateForumDialog = true" class="mr-2">
        Créer un forum
      </v-btn>
      <v-btn @click="showCreateThematiqueDialog = true">
        Créer une thématique
      </v-btn>
    </div>

<conversation-list v-model="drawer" title="Forums" :forums="forums" :selected-forum-id="selectedForum?.id" @chat-selected="handleForumSelect"/>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ForumService from '@/service/ForumService';
import CreateForumDialog from '@/components/CreateForumDialog.vue';
import CreateThematiqueDialog from "@/components/CreateThematiqueDialog.vue";
import ConversationList from "@/components/ConversationList.vue";
const drawer = ref(true);
const forums = ref([]);
const thematiques = ref([]);
const selectedForum = ref(null);
const showCreateForumDialog = ref(false);
const showCreateThematiqueDialog = ref(false);
const newMessageText = ref('');

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  ForumService.connect(user?.id);
  forums.value = await ForumService.getAllForums();
});

const selectForum = async (forum) => {
  selectedForum.value = forum;
  ForumService.joinForum(forum.id); //join ws forum room
};

const sendMessage = () => {
  if(newMessageText.value !== '' && selectedForum.value){
    ForumService.postMessage(selectedForum.value.id, newMessageText.value);
    newMessageText.value = '';
  }
};

const handleNewMessage = async (newMessage) => {
 //todo
};

const handleForumCreated = (newForum) => {
  forums.value.push(newForum);
  showCreateForumDialog.value = false;
};

const handleThematiqueCreated = (newThematique) => {
  thematiques.value.push(newThematique);
  showCreateThematiqueDialog.value = false;
};


</script>