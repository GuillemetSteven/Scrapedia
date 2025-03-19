<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore'; // Ajustez le chemin si nécessaire

const router = useRouter();
const llmStore = useLlmStore();

// Récupérer les générations depuis le store
const generations = computed(() => llmStore.generations);
const hasGenerations = computed(() => llmStore.hasGenerations);

// Variables pour la modal de confirmation
const showConfirmModal = ref(false);
const generationToDelete = ref(null);

// Fonction pour formater une date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Fonction pour voir le détail d'une génération
const viewGeneration = (generationId) => {
  llmStore.setCurrentGeneration(generationId);
  router.push(`/result/${generationId}`);
};

// Fonction pour ouvrir la modal de confirmation de suppression
const confirmDelete = (event, generationId) => {
  // Empêcher la propagation pour éviter de déclencher viewGeneration
  event.stopPropagation();
  generationToDelete.value = generationId;
  showConfirmModal.value = true;
};

// Fonction pour supprimer une génération
const deleteGeneration = () => {
  if (generationToDelete.value !== null) {
    llmStore.deleteGeneration(generationToDelete.value);
    closeModal();
  }
};

// Fonction pour fermer la modal
const closeModal = () => {
  showConfirmModal.value = false;
  generationToDelete.value = null;
};

// Fonction pour extraire le nom d'hôte d'une URL
const getHostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return url;
  }
};

// Fonction pour extraire le dernier segment de l'URL (après le dernier "/")
const getLastUrlSegment = (url) => {
  try {
    // Supprimer le slash final s'il existe
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    // Récupérer la partie après le dernier "/"
    const segments = cleanUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    // Décoder les caractères d'URL et remplacer les underscores par des espaces
    return decodeURIComponent(lastSegment).replace(/_/g, ' ');
  } catch (e) {
    return 'Contenu généré';
  }
};

// Fonction pour aller à la page de génération
const goToGeneratePage = () => {
  router.push('/generate');
};
</script>

<template>
  <div class="results-container">
    <div class="results-header">
      <h1>Générations IA</h1>
      <button @click="goToGeneratePage" class="new-generation-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nouvelle génération
      </button>
    </div>
    
    <div v-if="!hasGenerations" class="empty-results">
      <div class="empty-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18v-6"></path>
          <path d="M9 15h6"></path>
        </svg>
      </div>
      <p>Vous n'avez pas encore généré de contenu avec l'IA.</p>
      <button @click="goToGeneratePage" class="start-btn">
        Commencer
      </button>
    </div>
    
    <div v-else class="results-list">
      <div
        v-for="generation in generations"
        :key="generation.id"
        class="result-card"
        @click="viewGeneration(generation.id)"
      >
        <div class="result-details">
          <div class="result-title">
           {{ "Contenu généré pour :" }} {{ getLastUrlSegment(generation.url) }}
          </div>
          <div class="result-metadata">
            <div class="result-timestamp">
              <svg xmlns="http://www.w3.org/2000/svg" class="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ formatDate(generation.timestamp) }}
            </div>
            <!-- Removed the URL display from metadata since it's in the title -->
          </div>
          <div class="result-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" class="prompt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            "{{ generation.prompt }}"
          </div>
          <div class="result-url">
            <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {{ generation.url }}
          </div>
        </div>
        
        <div class="result-actions">
          <button 
            class="view-btn" 
            @click.stop="viewGeneration(generation.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Voir
          </button>
          <button 
            class="delete-btn" 
            @click="confirmDelete($event, generation.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Supprimer
          </button>
        </div>
      </div>  
    </div>
  </div>
  
  <!-- Confirmation modal -->
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
          <p>Êtes-vous sûr de vouloir supprimer cette génération ?</p>
          <div class="modal-actions">
            <button @click="closeModal" class="modal-btn cancel-btn">
              Annuler
            </button>
            <button @click="deleteGeneration" class="modal-btn confirm-btn">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.results-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #2d3748;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.new-generation-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1d3557;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(49, 130, 206, 0.2);
}

.new-generation-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
}

.plus-icon {
  width: 16px;
  height: 16px;
}

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.empty-illustration {
  color: #a0aec0;
  margin-bottom: 20px;
}

.empty-results p {
  margin-bottom: 25px;
  color: #4a5568;
  font-size: 17px;
}

.start-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(49, 130, 206, 0.2);
}

.start-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
}

.results-list {
  display: grid;
  gap: 16px;
}

.result-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #edf2f7;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

.result-details {
  flex: 1;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
}

.result-metadata {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.result-timestamp {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #2b2a2aaf; 
  background-color: #bcc2ca48;
}

.time-icon, .link-icon, .prompt-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
}

.result-prompt {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 15px;
  color: #38a169; 
  font-style: italic;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
  line-height: 1.4;
}

.result-prompt .prompt-icon {
  margin-top: 2px;
  flex-shrink: 0;
  stroke: #38a169; 
}

.result-url {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #3182ce;
  word-break: break-all;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-btn, .delete-btn {
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

.view-btn {
  background-color: #1d3557;
  color: white;
}

.view-btn:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
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

.eye-icon, .trash-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .results-container {
    padding: 16px;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .new-generation-btn {
    width: 100%;
    justify-content: center;
  }
  
  .result-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-metadata {
    flex-direction: column;
    gap: 8px;
  }
  
  .result-actions {
    flex-direction: row;
    margin-top: 16px;
    width: 100%;
  }
  
  .view-btn, .delete-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>

<style>

/* Styles non-scoped pour les éléments téléportés */
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
  color: #ed8936;
  margin-bottom: 20px;
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
</style>