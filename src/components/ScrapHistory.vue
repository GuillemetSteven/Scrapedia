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
    // Vérifier que la méthode existe avant de l'appeler
    // Si cette méthode n'existe pas, vous devez l'implémenter dans votre store
    if (typeof scrapStore.removeFromHistory === 'function') {
      scrapStore.removeFromHistory(itemToDelete.value);
    } else {
      // Solution alternative si la méthode n'existe pas
      // Vous devriez modifier votre store pour ajouter cette méthode
      console.error('La méthode removeFromHistory n\'existe pas dans le store');
      
      // Exemple de solution temporaire (à adapter selon votre store)
      // Ceci est juste un exemple, vous devez adapter selon votre structure de données
      /* 
      const updatedHistory = [...history.value];
      updatedHistory.splice(itemToDelete.value, 1);
      scrapStore.$patch({
        scrapHistory: updatedHistory
      });
      */
    }
    
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
  </div>
  
  <!-- Confirmation modal avec teleport corrigé -->
  <!-- Remplacez uniquement la partie de la modale dans votre template -->
<teleport to="body">
  <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3>Confirmation de suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        <div class="modal-actions">
          <button @click="closeModal" class="modal-btn cancel-btn">
            Annuler
          </button>
          <button @click="deleteHistoryItem" class="modal-btn confirm-btn">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</teleport>
</template>

<style>
/* Import des polices Google */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap');

.history-container {
  .history-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.header {
  padding: 25px 20px;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.empty-history {
  padding: 60px 20px;
  text-align: center;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.empty-message {
  color: #4a5568;
  font-size: 17px;
  font-weight: 300;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.history-item {
  position: relative;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #edf2f7;
}

.history-item:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

.history-item-content {
  flex: 1;
}

.history-url {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  word-break: break-all;
}

.history-metadata {
  display: flex;
  gap: 20px;
}

.elements-count, .timestamp {
  font-size: 14px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 6px;
}

.elements-count {
  color: #3182ce;
}

.timestamp {
  color: #718096;
  order: 2;
}

.timestamp::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>') no-repeat center center;
  background-size: contain;
  margin-right: 0;
}

.elements-count::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233182ce" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>') no-repeat center center;
  background-size: contain;
  margin-right: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.rescrape-btn {
  background-color: #1d3557;
  color: white;
}

.rescrape-btn:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
}

.rescrape-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.rescrape-btn::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>') no-repeat center center;
  background-size: contain;
}

.delete-btn {
  background-color: #fff5f5;
  color: #e53e3e;
  border: 1px solid #fed7d7;
}

.delete-btn:hover {
  background-color: #feebc8;
  border-color: #fbd38d;
  color: #dd6b20;
  transform: translateY(-1px);
}

.delete-btn::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23e53e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>') no-repeat center center;
  background-size: contain;
}

/* Styles pour le modal - exactement comme dans LlmResults */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background-color: white;
  width: 400px;
  max-width: 90vw;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content {
  padding: 30px;
  text-align: center;
}

.modal-icon {
  color: #f6ad55;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.modal-content h3 {
  margin: 0 0 15px;
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
}

.modal-content p {
  margin-bottom: 25px;
  color: #4a5568;
  font-size: 16px;
  font-weight: 400;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.cancel-btn {
  background-color: #edf2f7;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

.confirm-btn {
  background-color: #e53e3e;
  color: white;
}

.confirm-btn:hover {
  background-color: #c53030;
}

@media (max-width: 768px) {
  .history-container {
    padding: 16px;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: row;
    margin-top: 16px;
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .history-metadata {
    flex-direction: column;
    gap: 8px;
  }
}
}
</style>