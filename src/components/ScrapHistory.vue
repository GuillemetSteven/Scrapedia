<script setup>
import { computed } from 'vue';
import { useScrapStore } from '../stores/scrapStore'; // Ajustez le chemin si nécessaire

const scrapStore = useScrapStore();

// Récupération de l'historique depuis le store
const history = computed(() => scrapStore.scrapHistory);

// Fonction pour formater une date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Fonction pour relancer un scraping à partir de l'historique
const rescrapUrl = async (url) => {
  await scrapStore.fetchScrapData(url);
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
        <button @click="rescrapUrl(item.url)" class="rescrape-btn">
          Rescraper
        </button>
      </li>
    </ul>
  </div>
</template>


<style scoped>

.history-container {
  font-family: 'Pretendard', 'SUIT', sans-serif; 
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #111;
  background-color: #fafafa;
  border-radius: 5px;
}

h2 {
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  color: #000;
  position: relative;
  display: inline-block;
}

h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background-color: #000;
}

.empty-history {
  color: #777;
  padding: 2rem 0;
  text-align: center;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
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
  padding: 1.2rem 0;
  border-bottom: 1px solid #eee;
  gap: 1rem;
  transition: all 0.2s ease;
}

.history-item:hover {
  background-color: #f5f5f5;
}

.history-item-content {
  flex: 1;
}

.history-url {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  max-width: 600px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
}

.history-timestamp {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.3rem;
}

.history-count {
  font-size: 0.75rem;
  color: #555;
  font-weight: 500;
}

.rescrape-btn {
  background-color: transparent;
  color: #000;
  border: 1px solid #000;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  font-weight: 500;
  transition: all 0.2s ease;
}

.rescrape-btn:hover {
  background-color: #000;
  color: #fff;
}

/* Responsive */
@media screen and (max-width: 640px) {
  .history-container {
    padding: 1rem;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .history-item-content {
    width: 100%;
    margin-bottom: 0.8rem;
  }
  
  .rescrape-btn {
    width: 100%;
  }
}

</style>