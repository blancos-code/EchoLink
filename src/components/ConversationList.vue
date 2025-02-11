<template>
  <v-navigation-drawer v-model="drawer" width="350">
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="selectedForumId != null" icon="mdi-square-edit-outline" @click="$emit('create-chat')"></v-btn> </v-toolbar>

    <div class="pa-4">
      <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </div>

    <v-list lines="two" v-if="filteredChats.length > 0">
      <v-list-item
          v-for="chat in filteredChats"
          :key="chat.id"
          :title="chat.name || chat.titre"
      :active="selectedChatId === chat.id"
      @click="$emit('chat-selected', chat)"
      >
      <template v-slot:prepend>
        <v-avatar class="ma-1" size="48">
          <v-img :src="chat.participants[1].image"></v-img>
        </v-avatar>
      </template>
      <template v-slot:append>
          <span class="text-caption text-grey">
            {{ chat?.lastMessage?.date || chat.updatedAt  }}
          </span>
      </template>
      </v-list-item>
    </v-list>

    <v-list lines="two" v-if="filteredForums.length > 0">
      <v-list-item
          v-for="forum in filteredForums"
          :key="forum.id"
          :title="forum.titre || forum.titre"
          :active="selectedForumId === forum.id"
          @click="$emit('forum-selected', forum)"
      >
        <template v-slot:prepend>
          <v-avatar class="ma-1" size="48">
          </v-avatar>
        </template>
        <template v-slot:append>
          <span class="text-caption text-grey">
          </span>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  selectedChatId: {
    type: String,
    default: null
  },
  selectedForumId: {
    type: String,
    default: null
  },
  chats: {
    type: Array,
    default: () => []
  },
  forums: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Messages'
  }
});

const emit = defineEmits(['update:modelValue', 'chat-selected', 'create-chat']);


const drawer = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const search = ref('');

const filteredChats = computed(() => {
  if (!search.value) return props.chats;
  const searchTerm = search.value.toLowerCase();
  return props.chats.filter(chat => {
    const nameMatch = chat.name?.toLowerCase().includes(searchTerm) || chat.titre?.toLowerCase().includes(searchTerm) || false;
    const messageMatch = chat?.lastMessage?.text?.toLowerCase().includes(searchTerm) || false;
    return nameMatch || messageMatch;
  });
});

const filteredForums = computed(() => {
  if (!search.value) return props.forums;
  const searchTerm = search.value.toLowerCase();
  return props.forums.filter(forum => {
    const nameMatch = forum.titre?.toLowerCase().includes(searchTerm) || forum.titre?.toLowerCase().includes(searchTerm) || false;
    const forumMatch = forum?.lastMessage?.text?.toLowerCase().includes(searchTerm) || false;
    return nameMatch || forumMatch;
  });
});




</script>

<style scoped>

</style>