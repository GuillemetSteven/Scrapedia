<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore';

const route = useRoute();
const router = useRouter();
const llmStore = useLlmStore();

// Pour le bouton de retour en haut
const showScrollButton = ref(false);
const scrollThreshold = 300;
// Récupérer l'ID de la génération depuis l'URL
const generationId = computed(() => route.params.id);

// Récupérer les données de la génération
const generation = computed(() => {
  if (generationId.value) {
    return llmStore.getGenerationById(generationId.value);
  }
  return llmStore.currentGeneration;
});

// Vérifier si nous avons les données
const hasData = computed(() => !!generation.value);

// Formater les dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Fonction pour retourner à la liste des résultats
const goBack = () => {
  router.push('/results');
};

// Gérer l'affichage du bouton de retour en haut
const handleScroll = () => {
  showScrollButton.value = window.scrollY > scrollThreshold;
};

// Fonction pour retourner en haut de la page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Gérer le cas où nous n'avons pas les données
onMounted(() => {
  if (!hasData.value) {
    // Si on a un ID mais pas de génération, essayer de la définir comme courante
    if (generationId.value) {
      const success = llmStore.setCurrentGeneration(generationId.value);
      if (!success) {
        goBack(); // Rediriger si on ne trouve pas la génération
      }
    } else {
      goBack(); // Rediriger s'il n'y a pas d'ID
    }
  }
  
  // Réinitialiser la position de défilement
  window.scrollTo(0, 0);
  
  // Ajouter l'écouteur d'événement pour le défilement
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div v-if="hasData" class="result-detail-container">
      <div class="result-header">
        <button @click="goBack" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          <span>Retour</span>
        </button>
        <div class="page-info">
          <h1 class="result-title">{{ generation.generatedContent.title }}</h1>
          <div class="url-display">
            <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <a :href="generation.url" target="_blank" class="url-text">{{ generation.url }}</a>
          </div>
        </div>
      </div>
      
      <div class="result-metadata">
        <div class="metadata-item">
          <div class="metadata-label-container">
            <svg xmlns="http://www.w3.org/2000/svg" class="metadata-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="metadata-label">Date:</span>
          </div>
          <span class="metadata-value">{{ formatDate(generation.timestamp) }}</span>
        </div>
        <div class="metadata-item">
          <div class="metadata-label-container">
            <svg xmlns="http://www.w3.org/2000/svg" class="metadata-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="metadata-label">Prompt:</span>
          </div>
          <span class="metadata-value prompt-text">"{{ generation.prompt }}"</span>
        </div>
      </div>
      
      <div class="content-separator"></div>
      
      <div class="result-content">
        <!-- Utiliser v-html pour rendre le contenu HTML généré -->
        <div v-html="generation.generatedContent.content" class="generated-content"></div>
      </div>
      
      <!-- Bouton pour remonter en haut de la page -->
      <button 
        v-show="showScrollButton" 
        @click="scrollToTop" 
        class="scroll-top-btn"
        aria-label="Retour en haut">
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-up-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"></path>
        </svg>
      </button>
    </div>
    
    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement du contenu...</p>
    </div>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap');

.result-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Noto Sans', 'Noto Sans JP', sans-serif;
  position: relative;
  min-height: calc(100vh - 60px);
  color: #1d3557;
}

.result-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1d3557;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  background-color: #152638;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(29, 53, 87, 0.2);
}

.back-icon {
  width: 16px;
  height: 16px;
}

.page-info {
  flex: 1;
}

.result-title {
  color: #1d3557;
  margin: 0 0 12px 0;
  font-size: 2.2em;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.5px;
}

.url-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
}

.link-icon {
  width: 16px;
  height: 16px;
  color: #3182ce;
}

.url-text {
  font-family: monospace;
  word-break: break-all;
  color: #4a5568;
  background-color: #edf2f7;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
}

.url-text:hover {
  color: #3182ce;
  text-decoration: underline;
}

.result-metadata {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #374151;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.metadata-label-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metadata-icon {
  width: 18px;
  height: 18px;
  color: #3182ce;
}

.metadata-label {
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
}

.metadata-value {
  font-weight: 500;
  color: #163056;
  text-align: right;
  font-size: 15px;
  background-color: #bcc2ca48;
  padding: 4px 8px;
  border-radius: 4px;
}

.prompt-text {
  font-style: italic;
  color: #163056;
  padding: 8px 12px;
  display: block;
  background-color: #bcc2ca48;
  border-radius: 0 4px 4px 0;
  font-weight: 500;
  line-height: 1.5;
  margin-top: 4px;
}

.content-separator {
  height: 1px;
  background-color: #e2e8f0;
  margin: 30px 0;
}

.result-content {
  background-color: white;
  padding: 40px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  margin-bottom: 30px;
}

/* Style pour le contenu généré (v-html) */
:deep(.generated-content) {
  line-height: 1.7;
  color: #2d3748;
}

:deep(.generated-content h2) {
  color: #1d3557;
  margin-top: 0;
  margin-bottom: 22px;
  font-size: 24px;
  font-weight: 700;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

:deep(.generated-content h3) {
  color: #2d3748;
  margin-top: 28px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
}

:deep(.generated-content p) {
  margin-bottom: 18px;
  color: #4a5568;
}

:deep(.generated-content ul, .generated-content ol) {
  margin-bottom: 22px;
  padding-left: 20px;
  color: #4a5568;
}

:deep(.generated-content li) {
  margin-bottom: 8px;
}

:deep(.generated-content strong) {
  font-weight: 600;
  color: #2d3748;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin: 30px auto;
  max-width: 900px;
  min-height: 50vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(29, 53, 87, 0.2);
  border-radius: 50%;
  border-top-color: #1d3557;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #718096;
  font-size: 16px;
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3182ce;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: all 0.2s ease-in-out;
}

.scroll-top-btn:hover {
  background-color: #2a9d8f;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.arrow-up-icon {
  width: 24px;
  height: 24px;
}



@media (max-width: 768px) {
  .result-detail-container {
    padding: 20px 16px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .back-btn {
    width: 100%;
    justify-content: center;
  }
  
  .result-content {
    padding: 30px 20px;
  }
  
  .metadata-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .metadata-value {
    text-align: left;
    margin-top: 4px;
  }
  
  .scroll-top-btn {
    width: 44px;
    height: 44px;
    bottom: 20px;
    right: 20px;
  }
  
  .arrow-up-icon {
    width: 20px;
    height: 20px;
  }
}
</style>