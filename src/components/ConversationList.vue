<template>
  <v-navigation-drawer v-model="drawer" width="350">
    <!-- Header -->
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-square-edit-outline" @click="createChat()"></v-btn>
      <v-btn icon="mdi-table-edit" @click="createThematique()"></v-btn>
    </v-toolbar>

    <!-- Search -->
    <div class="pa-4">
      <v-text-field v-model="search" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify"
                    label="Search messages" single-line hide-details></v-text-field>
    </div>

    <!-- Chat List -->
    <v-list lines="two" v-if="title !== 'Forums'">
      <v-list-item v-for="chat in filteredChats" :key="chat._id" :title="chat.name"
                   :active="selectedChatId === chat.id" @click="selectChat(chat)">
        <template v-slot:prepend>
          <v-avatar class="ma-1" size="48">
            <v-img :src="chat.participants[1].image"></v-img>
          </v-avatar>
        </template>
        <template v-slot:append>
          <span class="text-caption text-grey">{{ chat.time }}</span>
        </template>
      </v-list-item>
    </v-list>


    <v-list lines="two" v-if="title === 'Forums'">
      <v-list-item v-for="forum in filteredForum" :key="forum._id" :title="forum.titre"
                   :active="selectedChatId === forum.id" @click="selectForum(forum)">
        <template v-slot:prepend>
          <v-avatar class="ma-1" size="48">

          </v-avatar>
        </template>
        <template v-slot:append>
          <span class="text-caption text-grey">{{ forum.titre }}</span>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ConversationList',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    selectedChatId: {
      type: Number,
      default: null
    },
    selectedForumId: {
      type: Number,
      default: null
    },
    chats: {
      type: Array,
      default: () => ([])
    },
    forums: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String,
      default: 'Messages'
    }
  },

  data() {
    return {
      search: '',
    }
  },

  computed: {
    drawer: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    filteredChats() {
      if (!this.search) return this.chats
      const searchTerm = this.search.toLowerCase()
      return this.chats.filter(chat =>
          chat.name.toLowerCase().includes(searchTerm) ||
          chat.lastMessage.toLowerCase().includes(searchTerm)
      )
    },
    filteredForum() {
      if (!this.search) return this.forums
      const searchTerm = this.search.toLowerCase()
      return this.forums.filter(forum =>
          forum.titre.toLowerCase().includes(searchTerm) ||
          forum.lastMessage.toLowerCase().includes(searchTerm)
      )
    }
  },

  methods: {
    selectChat(chat) {
      this.$emit('chat-selected', chat)
    },
    selectForum(forum) {
      this.$emit('forum-selected', forum)
    },
    createChat() {
      this.$emit('create-chat')
    },
    createThematique(){
      this.$emit('create-thematique')
    }
  }

}
</script>

<style scoped>

</style>