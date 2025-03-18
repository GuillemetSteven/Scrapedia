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
        Nouvelle génération
      </button>
    </div>
    
    <div v-if="!hasGenerations" class="empty-results">
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
            {{ generation.generatedContent.title || `Génération pour ${getHostname(generation.url)}` }}
          </div>
          <div class="result-timestamp">
            {{ formatDate(generation.timestamp) }}
          </div>
          <div class="result-prompt">
            "{{ generation.prompt }}"
          </div>
          <div class="result-url">
            {{ getHostname(generation.url) }}
          </div>
        </div>
        
        <div class="result-actions">
          <button 
            class="view-btn" 
            @click.stop="viewGeneration(generation.id)"
          >
            Voir
          </button>
          <button 
            class="delete-btn" 
            @click="confirmDelete($event, generation.id)"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
    
    <!-- Confirmation modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <p>Êtes-vous sûr de vouloir supprimer cette génération ?</p>
          <div class="modal-actions">
            <button @click="closeModal" class="modal-btn cancel-btn">Annuler</button>
            <button @click="deleteGeneration" class="modal-btn confirm-btn">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #343a40;
  margin: 0;
}

.new-generation-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.new-generation-btn:hover {
  background-color: #218838;
}

.empty-results {
  text-align: center;
  padding: 50px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.start-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.start-btn:hover {
  background-color: #0056b3;
}

.results-list {
  display: grid;
  gap: 15px;
}

.result-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.result-details {
  flex: 1;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 5px;
}

.result-timestamp {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 8px;
}

.result-prompt {
  font-size: 15px;
  color: #495057;
  font-style: italic;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}

.result-url {
  font-size: 14px;
  color: #007bff;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.view-btn, .delete-btn {
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #17a2b8;
  color: white;
}

.view-btn:hover {
  background-color: #138496;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
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
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .result-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-actions {
    flex-direction: row;
    margin-top: 15px;
    width: 100%;
  }
  
  .view-btn, .delete-btn {
    flex: 1;
  }
}
</style>