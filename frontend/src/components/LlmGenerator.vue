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
const promptInputRef = ref(null);

// Données scrapées disponibles
const hasScrapedData = computed(() => scrapStore.hasData);
const scrapedUrl = computed(() => scrapStore.url);
const headingsCount = computed(() => scrapStore.headings.length);
const paragraphsCount = computed(() => scrapStore.paragraphs.length);

// Exemples de prompts prédéfinis
const promptExamples = [
  "Résumez ce contenu en 100 mots",
  "Extraire les points clés de ce texte",
  "Générer un article simplifié basé sur ce contenu",
  "Créer une liste des concepts importants mentionnés",
  "Réécrivez ce contenu pour un public non spécialisé"
];

// Fonction pour définir un prompt prédéfini
const setPromptExample = (example) => {
  prompt.value = example;
  // Focus sur le textarea après avoir sélectionné un exemple
  if (promptInputRef.value) {
    promptInputRef.value.focus();
  }
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

// Gérer l'envoi du prompt avec la touche Entrée (avec Shift+Entrée pour nouvelle ligne)
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    generateWithLLM();
  }
};

// Ajuster automatiquement la hauteur du textarea
const adjustTextareaHeight = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
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
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="prompt-input-container">
        <div class="prompt-input-wrapper">
          <textarea
            ref="promptInputRef"
            v-model="prompt"
            placeholder="Écrivez votre instruction pour l'IA..."
            class="prompt-textarea"
            @keydown="handleKeydown"
            @input="adjustTextareaHeight"
          ></textarea>
          <button 
            @click="generateWithLLM"
            class="send-button"
            :disabled="isGenerating || !prompt.trim()"
            :class="{ 'is-generating': isGenerating }"
          >
            <span v-if="isGenerating" class="spinner"></span>
            <svg v-else class="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="input-info">
          Appuyez sur <kbd>Entrée</kbd> pour envoyer, <kbd>Maj+Entrée</kbd> pour un saut de ligne
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.llm-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

h2 {
  margin-bottom: 24px;
  color: #343a40;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
}

.no-data-message {
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.action-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-1px);
}

.llm-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.data-summary {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.data-summary h3 {
  margin-top: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.url-text {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  word-break: break-all;
  color: #3182ce;
  background-color: #ebf4ff;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 14px;
}

.prompt-examples h3 {
  margin-top: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.example-btn {
  background-color: #f0f4f8;
  border: 1px solid #dbe4ef;
  color: #3d4852;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-1px);
}

.error-message {
  background-color: #fff5f5;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 5px;
  border-left: 4px solid #e53e3e;
  font-size: 14px;
}

.prompt-input-container {
  position: relative;
  margin-top: 10px;
}

.prompt-input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.prompt-textarea {
  width: 100%;
  min-height: 60px;
  max-height: 200px;
  padding: 16px 60px 16px 20px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  resize: none;
  line-height: 1.5;
  color: #1a202c;
  background-color: #fff;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);
}

.prompt-textarea::placeholder {
  color: #a0aec0;
}

.send-button {
  position: absolute;
  right: 16px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #3182ce;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.send-button:hover:not(:disabled) {
  background-color: #2b6cb0;
  transform: translateY(-1px);
}

.send-button:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.send-button.is-generating {
  background-color: #718096;
}

.send-icon {
  width: 18px;
  height: 18px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.input-info {
  font-size: 12px;
  color: #718096;
  margin-top: 8px;
  text-align: center;
}

kbd {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  color: #4a5568;
  display: inline-block;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  line-height: 1;
  padding: 2px 4px;
  vertical-align: middle;
}

/* Responsive styles */
@media (max-width: 768px) {
  .llm-container {
    padding: 16px;
  }
  
  .prompt-textarea {
    padding: 14px 54px 14px 16px;
    font-size: 15px;
  }
  
  .send-button {
    width: 32px;
    height: 32px;
    right: 12px;
    bottom: 10px;
  }
  
  .send-icon {
    width: 16px;
    height: 16px;
  }
  
  .examples-list {
    flex-direction: column;
    gap: 8px;
  }
  
  .example-btn {
    text-align: left;
  }
}
</style>