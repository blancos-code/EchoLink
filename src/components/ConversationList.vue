<template>
  <v-navigation-drawer v-model="drawer" width="350">
    <!-- Header -->
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-square-edit-outline" @click="createChat()"></v-btn>
      <v-btn v-if="isForum" icon="mdi-table-edit" @click="createThematique()"></v-btn>
    </v-toolbar>

    <!-- Search -->
    <div class="pa-4">
      <v-text-field
        v-model="search"
        density="compact"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        label="Search messages"
        single-line
        hide-details
      ></v-text-field>
    </div>

    <!-- Chat List -->
    <v-list lines="two">
      <!-- Élément épinglé pour l’assistant IA -->
      <v-list-item
        title="Assistant IA"
        prepend-icon="mdi-robot"
        @click="selectAIChat"
        :active="selectedChatId === 'ai-assistant'"
        class="pinned-item"
      >
        <template v-slot:prepend>
          <v-avatar class="ma-1" size="48">
            <v-img src="https://cdn-icons-png.flaticon.com/512/4712/4712076.png" alt="IA Avatar"></v-img>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-chip color="blue" small>IA</v-chip>
        </template>
      </v-list-item>

      <!-- Liste des conversations normales -->
      <template v-if="title !== 'Forums'">
        <v-list-item
          v-for="chat in filteredChats"
          :key="chat._id"
          :title="chat.name"
          :active="selectedChatId === chat.id"
          @click="selectChat(chat)"
        >
          <template v-slot:prepend>
            <v-avatar class="ma-1" size="48">
              <v-img :src="chat.participants[1].image"></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <span class="text-caption text-grey">{{ chat.time }}</span>
          </template>
        </v-list-item>
      </template>

      <!-- Liste des forums -->
      <template v-if="title === 'Forums'">
        <v-list-item
          v-for="forum in filteredForum"
          :key="forum._id"
          :title="forum.titre"
          :active="selectedChatId === forum.id"
          @click="selectForum(forum)"
        >
          <template v-slot:prepend>
            <v-avatar class="ma-1" size="48">
              <!-- Avatar vide pour les forums, tu peux ajouter une image si besoin -->
            </v-avatar>
          </template>
          <template v-slot:append>
            <span class="text-caption text-grey">{{ forum.titre }}</span>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ConversationList',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    selectedChatId: {
      type: [Number, String],
      default: null,
    },
    selectedForumId: {
      type: Number,
      default: null,
    },
    chats: {
      type: Array,
      default: () => [],
    },
    forums: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Messages',
    },
    isForum: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      search: '',
    };
  },

  computed: {
    drawer: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    filteredChats() {
      if (!this.search) return this.chats;
      const searchTerm = this.search.toLowerCase();
      return this.chats.filter(
        chat =>
          chat.name.toLowerCase().includes(searchTerm) ||
          chat.lastMessage.toLowerCase().includes(searchTerm)
      );
    },
    filteredForum() {
      if (!this.search) return this.forums;
      const searchTerm = this.search.toLowerCase();
      return this.forums.filter(
        forum =>
          forum.titre.toLowerCase().includes(searchTerm) ||
          forum.lastMessage.toLowerCase().includes(searchTerm)
      );
    },
  },

  methods: {
    selectChat(chat) {
      this.$emit('chat-selected', chat);
    },
    selectForum(forum) {
      this.$emit('forum-selected', forum);
    },
    createChat() {
      this.$emit('create-chat');
    },
    createThematique() {
      this.$emit('create-thematique');
    },
    selectAIChat() {
      const aiChat = {
        id: 'ai-assistant',
        name: 'Assistant IA',
        participants: [
          { _id: 'current-user', nom: 'Vous', prenom: '', image: '' },
          { _id: 'ai', nom: 'Assistant', prenom: 'IA', image: 'https://cdn-icons-png.flaticon.com/512/4712/4712076.png' },
        ],
        lastMessage: 'Comment puis-je vous aider ?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      this.$emit('chat-selected', aiChat);
    },
  },
};
</script>

<style scoped>
.pinned-item {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>