<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore'; // Ajustez le chemin si nécessaire

const router = useRouter();
const scrapStore = useScrapStore();
const isLoading = ref(false);
const activeItemIndex = ref(-1);

// Récupération de l'historique depuis le store
const history = computed(() => scrapStore.scrapHistory);

// Fonction pour formater une date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Fonction pour relancer un scraping à partir de l'historique
const rescrapUrl = async (url, index) => {
  isLoading.value = true;
  activeItemIndex.value = index;
  
  try {
    const success = await scrapStore.rescrapUrl(url);
    if (success) {
      // Naviguer vers la page Scrap pour voir les résultats
      router.push('/scrap');
    }
  } catch (error) {
    console.error('Erreur lors du rescraping:', error);
  } finally {
    isLoading.value = false;
    activeItemIndex.value = -1;
  }
};
</script>

<template>
  <div class="history-container">
    <h2>Historique des scrapings</h2>
    
    <div v-if="history.length === 0" class="empty-history">
      Aucun scraping effectué pour l'instant.
    </div>
    
    <ul v-else class="history-list">
      <li v-for="(item, index) in history" :key="index" class="history-item">
        <div class="history-item-content">
          <div class="history-url">{{ item.url }}</div>
          <div class="history-timestamp">{{ formatDate(item.timestamp) }}</div>
          <div class="history-count">{{ item.elementsCount }} éléments récupérés</div>
        </div>
        <button 
          @click="rescrapUrl(item.url, index)" 
          class="rescrape-btn"
          :disabled="isLoading && activeItemIndex === index"
        >
          {{ isLoading && activeItemIndex === index ? 'En cours...' : 'Rescraper' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.history-container {
  margin-top: 30px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-history {
  font-style: italic;
  color: #6c757d;
  padding: 10px;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item-content {
  flex: 1;
  text-align: left;
}

.history-url {
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
  word-break: break-all;
}

.history-timestamp {
  font-size: 0.8em;
  color: #6c757d;
}

.history-count {
  font-size: 0.9em;
  color: #28a745;
}

.rescrape-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.rescrape-btn:hover {
  background-color: #5a6268;
}

.rescrape-btn:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
}
</style>