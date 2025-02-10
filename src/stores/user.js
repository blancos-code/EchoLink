import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userId: null,
    username: null,
  }),
  actions: {
    setUser(user) {
      this.userId = user.id;
      this.username = user.username;
    },
    clearUser() {
      this.userId = null;
      this.username = null;
    }
  },
  persist: true,
});
