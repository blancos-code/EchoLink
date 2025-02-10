<template>
  <v-dialog v-model="dialogModel" max-width="400px">
    <v-card>
      <v-card-title>Créer une conversation</v-card-title>
      <v-card-text>
        <v-text-field v-model="newChatName" label="Nom du Chat" required></v-text-field>
        <v-list>
          <v-list-item v-for="user in users" :key="user.id" @click="selectUser(user)" class="cursor-pointer">
            <template v-slot:prepend>
              <v-avatar>
                <img :src="user.image" alt="User Avatar" class="avatar-img">
              </v-avatar>
            </template>
            <v-list-item-title>{{ user.nom + " " + user.prenom }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancel">Annuler</v-btn>
        <v-btn color="primary" @click="createChat">Créer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed, watch, onMounted } from 'vue';
import MessageService from '../service/MessageService';
import UserService from '../service/userService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'chatCreated', 'cancelCreation']);

// Create a computed property for v-model handling
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const newChatName = ref('');
const selectedUser = ref(null);
const users = ref([]);

const selectUser = (user) => {
  selectedUser.value = user;
  newChatName.value = user.nom + " " + user.prenom;
};

const loadUsers = async () => {
  users.value = await UserService.getAllUsers();
};

// Reset form when dialog closes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    newChatName.value = '';
    selectedUser.value = null;
  }
});

// Load users when component is mounted
onMounted(loadUsers);

const createChat = async () => {
  if (!newChatName.value || !selectedUser.value) {
    return alert('Veuillez sélectionner un utilisateur et un nom de chat.');
  }
  
  try {
    const newChat = await MessageService.createChat({
      name: newChatName.value,
      participantId: selectedUser.value.id,
    });
    emit('chatCreated', newChat);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erreur lors de la création du chat:', error);
  }
};

const cancel = () => {
  emit('update:modelValue', false);
  emit('cancelCreation');
};
</script>

<style scoped>
.avatar-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
</style>