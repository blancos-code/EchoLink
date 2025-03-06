<template>
  <v-navigation-drawer v-model="drawer" width="350" class="modern-drawer">
    <!-- Header -->
    <div class="header">
      <h3 class="header-title">{{ title }}</h3>
      <v-btn icon="mdi-plus" variant="text" @click="createThematique" v-if="isForum" class="header-btn" />
    </div>

    <!-- Filter Buttons -->
    <div class="filter-container" v-if="isForum">
      <v-chip-group v-model="filterType" mandatory column>
        <v-chip value="none" variant="outlined" class="filter-chip">Tous</v-chip>
        <v-chip value="thematique" variant="outlined" class="filter-chip">Thématiques</v-chip>
        <v-chip value="zone" variant="outlined" class="filter-chip">Zones</v-chip>
      </v-chip-group>
    </div>

    <!-- Search -->
    <div class="search-container">
      <v-text-field
        v-model="search"
        density="compact"
        variant="solo"
        prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher un forum..."
        hide-details
        class="modern-search"
      />
    </div>

    <!-- Forum List -->
    <v-list class="forum-list" v-if="isForum">
      <!-- Grouped View -->
      <template v-if="filterType !== 'none'">
        <div v-for="(group, key) in groupedForums" :key="key" class="group-section">
          <v-subheader class="group-header">{{ getGroupTitle(key) }}</v-subheader>
          <v-list-item
            v-for="forum in group"
            :key="forum._id"
            :title="forum.titre"
            :active="selectedForumId === forum.id"
            @click="selectForum(forum)"
            class="forum-item"
          >
            <template v-slot:prepend>
              <v-avatar size="40" class="forum-avatar">
                <v-icon>mdi-forum</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <span class="last-message-time">{{ formatDate(forum.lastMessage?.date) }}</span>
            </template>
          </v-list-item>
        </div>
      </template>

      <!-- Flat View -->
      <template v-else>
        <v-list-item
          v-for="forum in filteredForum"
          :key="forum._id"
          :title="forum.titre"
          :active="selectedForumId === forum.id"
          @click="selectForum(forum)"
          class="forum-item"
        >
          <template v-slot:prepend>
            <v-avatar size="40" class="forum-avatar">
              <v-icon>mdi-forum</v-icon>
            </v-avatar>
          </template>
          <template v-slot:append>
            <span class="last-message-time">{{ formatDate(forum.lastMessage?.date) }}</span>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ForumList',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    selectedForumId: {
      type: Number,
      default: null
    },
    forums: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String,
      default: 'Forums'
    },
    isForum: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      search: '',
      filterType: 'none', // 'none', 'thematique', or 'zone'
      thematiqueTitles: {} // Cache pour stocker les titres des thématiques
    }
  },

  watch: {
    // Observer les changements dans forums pour mettre à jour thematiqueTitles
    forums: {
      handler(newForums) {
        this.updateThematiqueTitles(newForums)
      },
      deep: true, // Nécessaire car forums est un tableau d'objets
      immediate: true // S'exécute au montage avec la valeur initiale
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
    filteredForum() {
      if (!this.search) return this.forums
      const searchTerm = this.search.toLowerCase()
      return this.forums.filter(forum =>
        forum.titre.toLowerCase().includes(searchTerm) ||
        (forum.lastMessage?.text || '').toLowerCase().includes(searchTerm)
      )
    },
    groupedForums() {
      if (this.filterType === 'none') return {}
      const groupKey = this.filterType === 'thematique' ? 'thematique' : 'zone_geographique'
      const groups = this.filteredForum.reduce((groups, forum) => {
        let key
        if (groupKey === 'thematique') {
          key = forum[groupKey]?._id || 'Non spécifié'
        } else {
          key = forum[groupKey] || 'Non spécifié'
        }
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(forum)
        return groups
      }, {})
      return groups
    }
  },

  methods: {
    selectForum(forum) {
      this.$emit('forum-selected', forum)
    },
    createThematique() {
      this.$emit('create-forum')
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    getGroupTitle(key) {
      if (this.filterType === 'thematique') {
        return this.thematiqueTitles[key] || key
      }
      return key
    },
    updateThematiqueTitles(forums) {
      forums.forEach(forum => {
        if (forum.thematique && forum.thematique._id && forum.thematique.titre) {
          this.thematiqueTitles[forum.thematique._id] = forum.thematique.titre
        }
      })
    }
  }
}
</script>

<style scoped>
.modern-drawer {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-btn {
  margin-left: auto;
  color: #3498db;
}

.filter-container {
  padding: 10px 20px;
}

.filter-chip {
  border-radius: 20px;
  text-transform: none;
  font-weight: 500;
  color: #2c3e50;
}

.filter-chip.v-chip--selected {
  background-color: #3498db;
  color: white;
}

.search-container {
  padding: 10px 20px;
}

.modern-search {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.forum-list {
  padding: 0;
}

.group-section {
  margin-bottom: 16px;
}

.group-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #7f8c8d;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 8px 20px;
}

.forum-item {
  padding: 10px 20px;
  transition: all 0.2s ease;
}

.forum-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.forum-item.v-list-item--active {
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.forum-avatar {
  background-color: #ecf0f1;
  color: #3498db;
}

.last-message-time {
  font-size: 0.75rem;
  color: #95a5a6;
}
</style>