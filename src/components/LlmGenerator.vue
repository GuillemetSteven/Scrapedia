<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore';
import { useScrapStore } from '../stores/scrapStore';

const router = useRouter();
const scrapStore = useScrapStore();
const llmStore = useLlmStore();

// État local
const prompt = ref('');
const isGenerating = ref(false);
const error = ref('');

// Données scrapées disponibles
const hasScrapedData = computed(() => scrapStore.hasData);
const scrapedUrl = computed(() => scrapStore.url);
const headingsCount = computed(() => scrapStore.headings.length);
const paragraphsCount = computed(() => scrapStore.paragraphs.length);

// Exemples de prompts prédéfinis
const promptExamples = [
  "Résumez ce contenu en 500 mots",
  "Extraire les points clés de ce texte",
  "Générer un article simplifié basé sur ce contenu",
  "Créer une liste des concepts importants mentionnés",
  "Réécrivez ce contenu pour un public non spécialisé"
];

// Fonction pour définir un prompt prédéfini
const setPromptExample = (example) => {
  prompt.value = example;
};

// Fonction pour envoyer les données au LLM
const generateWithLLM = async () => {
  if (!prompt.value.trim()) {
    error.value = "Veuillez entrer un prompt pour le LLM.";
    return;
  }
  
  isGenerating.value = true;
  error.value = '';
  
  try {
    // Créer un objet avec toutes les données nécessaires
    const requestData = {
      url: scrapedUrl.value,
      prompt: prompt.value,
      scrapedData: {
        headings: scrapStore.headings,
        paragraphs: scrapStore.paragraphs
      }
    };
    
    // Envoyer au store LLM
    const success = await llmStore.generateContent(requestData);
    
    if (success) {
      // Rediriger vers la page des résultats générés
      router.push('/results');
    }
  } catch (err) {
    console.error("Erreur lors de la génération de contenu:", err);
    error.value = "Une erreur est survenue lors de la génération du contenu.";
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="llm-container">
    <h2>Générer du contenu avec IA</h2>
    
    <div v-if="!hasScrapedData" class="no-data-message">
      <p>Vous devez d'abord scraper des données pour pouvoir générer du contenu.</p>
      <button @click="router.push('/scrap')" class="action-btn">
        Aller à la page de scraping
      </button>
    </div>
    
    <div v-else class="llm-form">
      <div class="data-summary">
        <h3>Données disponibles:</h3>
        <p>URL: <span class="url-text">{{ scrapedUrl }}</span></p>
        <p><strong>{{ headingsCount }}</strong> titres et <strong>{{ paragraphsCount }}</strong> paragraphes récupérés</p>
      </div>
      
      <div class="prompt-examples">
        <h3>Suggestions de prompts:</h3>
        <div class="examples-list">
          <button 
            v-for="(example, index) in promptExamples"
            :key="index"
            @click="setPromptExample(example)"
            class="example-btn"
          >
            {{ example }}
          </button>
        </div>
      </div>
      
      <div class="prompt-input">
        <label for="llm-prompt">Votre instruction pour l'IA:</label>
        <textarea
          id="llm-prompt"
          v-model="prompt"
          placeholder="Exemple: Résumez ce contenu en 500 mots"
          rows="4"
          class="prompt-textarea"
        ></textarea>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <button 
        @click="generateWithLLM" 
        class="generate-btn"
        :disabled="isGenerating || !prompt.trim()"
      >
        <span v-if="isGenerating">Génération en cours...</span>
        <span v-else>Générer le contenu</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.llm-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #343a40;
  text-align: center;
}

.no-data-message {
  text-align: center;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.action-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #0056b3;
}

.llm-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.url-text {
  font-family: monospace;
  word-break: break-all;
  color: #0066cc;
}

.prompt-examples {
  margin-bottom: 20px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.example-btn {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  color: #495057;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.example-btn:hover {
  background-color: #dee2e6;
  border-color: #adb5bd;
}

.prompt-input {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #495057;
}

.prompt-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.generate-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;
}

.generate-btn:hover {
  background-color: #218838;
}

.generate-btn:disabled {
  background-color: #a7c9b4;
  cursor: not-allowed;
}
</style>