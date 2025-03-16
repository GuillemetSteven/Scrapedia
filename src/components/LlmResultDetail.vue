<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore'; // Ajustez le chemin si nécessaire

const route = useRoute();
const router = useRouter();
const llmStore = useLlmStore();

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
});
</script>

<template>
  <div class="result-detail-container" v-if="hasData">
    <div class="result-header">
      <button @click="goBack" class="back-btn">
        &larr; Retour
      </button>
      <h1 class="result-title">{{ generation.generatedContent.title }}</h1>
    </div>
    
    <div class="result-metadata">
      <div class="metadata-item">
        <span class="metadata-label">Date:</span>
        <span class="metadata-value">{{ formatDate(generation.timestamp) }}</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Source:</span>
        <a :href="generation.url" target="_blank" class="metadata-link">{{ generation.url }}</a>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Prompt:</span>
        <span class="metadata-value prompt-text">"{{ generation.prompt }}"</span>
      </div>
    </div>
    
    <div class="content-separator"></div>
    
    <div class="result-content">
      <!-- Utiliser v-html pour rendre le contenu HTML généré -->
      <div v-html="generation.generatedContent.content" class="generated-content"></div>
    </div>
    
    <div class="result-actions">
      <button @click="goBack" class="action-btn back-to-list">
        Retour à la liste
      </button>
    </div>
  </div>
  
  <div v-else class="loading-container">
    Chargement du contenu...
  </div>
</template>

<style scoped>
.result-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.result-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.back-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 15px;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #e9ecef;
}

.result-title {
  font-size: 28px;
  color: #343a40;
  margin: 0;
  flex: 1;
}

.result-metadata {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.metadata-item {
  margin-bottom: 10px;
}

.metadata-item:last-child {
  margin-bottom: 0;
}

.metadata-label {
  font-weight: 600;
  color: #495057;
  margin-right: 10px;
}

.metadata-value {
  color: #6c757d;
}

.metadata-link {
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
}

.metadata-link:hover {
  text-decoration: underline;
}

.prompt-text {
  font-style: italic;
}

.content-separator {
  height: 1px;
  background-color: #dee2e6;
  margin: 30px 0;
}

.result-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

/* Style pour le contenu généré (v-html) */
:deep(.generated-content) {
  line-height: 1.6;
  color: #212529;
}

:deep(.generated-content h2) {
  color: #343a40;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

:deep(.generated-content h3) {
  color: #495057;
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 20px;
}

:deep(.generated-content p) {
  margin-bottom: 15px;
}

:deep(.generated-content ul, .generated-content ol) {
  margin-bottom: 20px;
  padding-left: 20px;
}

:deep(.generated-content li) {
  margin-bottom: 8px;
}

:deep(.generated-content strong) {
  font-weight: 600;
  color: #212529;
}

.result-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.back-to-list {
  background-color: #6c757d;
  color: white;
}

.back-to-list:hover {
  background-color: #5a6268;
}

.loading-container {
  text-align: center;
  padding: 50px;
  color: #6c757d;
  font-style: italic;
}
</style>