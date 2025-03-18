<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore';

const router = useRouter();
const scrapStore = useScrapStore();
const isLoading = ref(false);
const activeItemIndex = ref(-1);
const showConfirmModal = ref(false);
const itemToDelete = ref(null);

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

// Fonction pour ouvrir la modal de confirmation de suppression
const confirmDelete = (index) => {
  itemToDelete.value = index;
  showConfirmModal.value = true;
};

// Fonction pour supprimer un élément de l'historique
const deleteHistoryItem = () => {
  if (itemToDelete.value !== null) {
    // Ajout de la fonctionnalité de suppression dans le store
    scrapStore.removeFromHistory(itemToDelete.value);
    showConfirmModal.value = false;
    itemToDelete.value = null;
  }
};

// Fonction pour fermer la modal
const closeModal = () => {
  showConfirmModal.value = false;
  itemToDelete.value = null;
};
</script>

<template>
  <div class="history-container">
    <div class="header">
      <h2>Scraping History</h2>
    </div>
    
    <div v-if="history.length === 0" class="empty-history">
      <div class="empty-message">No scraping data available yet</div>
    </div>
    
    <ul v-else class="history-list">
      <li v-for="(item, index) in history" :key="index" class="history-item">
        <div class="history-item-content">
          <div class="history-url">{{ item.url }}</div>
          <div class="history-metadata">
            <span class="timestamp">{{ formatDate(item.timestamp) }}</span>
            <span class="elements-count">{{ item.elementsCount }} éléments</span>
          </div>
        </div>
        <div class="action-buttons">
          <button 
            @click="rescrapUrl(item.url, index)" 
            class="action-btn rescrape-btn"
            :disabled="isLoading && activeItemIndex === index"
          >
            <span v-if="isLoading && activeItemIndex === index">Processing...</span>
            <span v-else>Rescrape</span>
          </button>
          <button 
            @click="confirmDelete(index)" 
            class="action-btn delete-btn"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    
    <!-- Confirmation modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
          <div class="modal-actions">
            <button @click="closeModal" class="modal-btn cancel-btn">Annuler</button>
            <button @click="deleteHistoryItem" class="modal-btn confirm-btn">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.history-container {
  margin-top: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.header {
  padding: 25px 20px;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
}

.header h2 {
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin: 0;
  letter-spacing: 1px;
}

.empty-history {
  padding: 60px 20px;
  text-align: center;
  background-color: #fff;
}

.empty-message {
  color: #999;
  font-size: 16px;
  font-weight: 300;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  position: relative;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  background-color: #fff;
  transition: all 0.2s ease;
}

.history-item:hover {
  background-color: #f5f5f7;
  transform: translateY(-1px);
}

.history-item-content {
  flex: 1;
}

.history-url {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  word-break: break-all;
}

.history-metadata {
  display: flex;
  gap: 25px;
}

.timestamp, .elements-count {
  font-size: 13px;
  color: #888;
  display: flex;
  align-items: center;
}

.timestamp::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: #999;
  border-radius: 50%;
  margin-right: 8px;
}

.elements-count::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: #999;
  border-radius: 50%;
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.rescrape-btn {
  background-color: #333;
  color: white;
}

.rescrape-btn:hover {
  background-color: #555;
}

.rescrape-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #ff5252;
  color: white;
}

.delete-btn:hover {
  background-color: #ff3333;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-container {
  background-color: white;
  width: 350px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-content {
  padding: 30px 25px 25px;
  text-align: center;
}

.modal-content p {
  margin-bottom: 25px;
  color: #333;
  font-size: 16px;
  font-weight: 400;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-btn {
  background-color: #ff5252;
  color: white;
}

.confirm-btn:hover {
  background-color: #ff3333;
}

@media (max-width: 768px) {
  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    margin-top: 15px;
    align-self: flex-end;
  }
  
  .history-metadata {
    flex-direction: column;
    gap: 5px;
  }
}
</style>