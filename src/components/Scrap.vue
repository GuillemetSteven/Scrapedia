<script setup>
import { computed, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore';

const router = useRouter();
const scrapStore = useScrapStore();
const url = ref(scrapStore.url);
const scrapHeadings = ref(scrapStore.scrapeOptions.headings);
const scrapParagraphs = ref(scrapStore.scrapeOptions.paragraphs);
const loadingTimeout = ref(null);
const resultsRef = ref(null); // Référence pour le scroll

watch(scrapHeadings, (newValue) => {
  scrapStore.setScrapOptions({ headings: newValue });
});

watch(scrapParagraphs, (newValue) => {
  scrapStore.setScrapOptions({ paragraphs: newValue });
});

const paragraphs = computed(() => scrapStore.paragraphs);
const headings = computed(() => scrapStore.headings);
const isLoading = computed(() => scrapStore.isLoading);
const error = computed(() => scrapStore.error);

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isWikipedia = computed(() => {
  if (!url.value) return false;
  return url.value.includes('wikipedia.org');
});

const urlError = computed(() => {
  if (!url.value || url.value.trim() === '') return '';
  if (!isValidUrl(url.value)) return 'URL invalide. Assurez-vous qu\'elle commence par http:// ou https://';
  if (!isWikipedia.value) return 'Cette application est optimisée pour les pages Wikipedia uniquement.';
  return '';
});

const canSubmit = computed(() => {
  return isValidUrl(url.value) && isWikipedia.value && !isLoading.value;
});

// Fonction pour faire défiler la page vers les résultats
const scrollToResults = () => {
  if (resultsRef.value) {
    // Attendre que le DOM soit mis à jour
    nextTick(() => {
      resultsRef.value.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

const fetchScrapData = async () => {
  if (!canSubmit.value) return;
  
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
  
  loadingTimeout.value = setTimeout(() => {
    if (isLoading.value) {
      scrapStore.setError("La requête prend plus de temps que prévu. Vérifiez votre connexion ou l'URL.");
      scrapStore.setLoading(false);
    }
  }, 45000);
  
  await scrapStore.fetchScrapData(url.value);
  
  clearTimeout(loadingTimeout.value);
  loadingTimeout.value = null;
  
  // Scroll vers les résultats si l'extraction a réussi
  if (headings.value.length > 0 || paragraphs.value.length > 0) {
    scrollToResults();
  }
};

const goToDetailPage = () => {
  router.push('/detail');
};

onBeforeUnmount(() => {
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
});
</script>

<template>
  <div class="scrap-container">
    <div class="scrap-header">
      <h1>Extraction de contenu</h1>
      <p class="subtitle">Extrayez facilement des titres et paragraphes de Wikipedia</p>
    </div>
    
    <div class="card url-card">
      <div class="card-body">
        <div class="url-input-container">
          <label for="url-input">URL à extraire</label>
          <div class="input-wrapper">
            <input 
              id="url-input"
              v-model="url" 
              type="url" 
              placeholder="Entrez l'URL d'une page Wikipedia" 
              class="url-input"
              :class="{'error-input': urlError}"
            />
          </div>
          <div v-if="urlError" class="error-message">{{ urlError }}</div>
        </div>
        
        <div class="info-box">
          <p>Exemple: https://fr.wikipedia.org/wiki/France</p>
        </div>
        
        <div class="extraction-options">
          <h3>Options d'extraction</h3>
          <div class="options-container">
            <div class="option-card">
              <div class="option-content">
                <div class="option-text">
                  <h4>Titres</h4>
                  <p>Extraire les titres et sous-titres</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="scrapHeadings">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-card">
              <div class="option-content">
                <div class="option-text">
                  <h4>Paragraphes</h4>
                  <p>Extraire le texte des paragraphes</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="scrapParagraphs">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <button 
          @click="fetchScrapData" 
          class="extract-btn" 
          :disabled="!canSubmit || isLoading"
        >
          {{ isLoading ? 'Extraction en cours...' : 'Extraire le contenu' }}
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-alert">
      <div class="alert-content">
        <h4>Erreur lors de l'extraction</h4>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div 
      v-if="headings.length > 0 || paragraphs.length > 0" 
      class="results-section"
      ref="resultsRef"
    >
      <div class="results-summary">
        <div class="card summary-card">
          <div class="summary-content">
            <div class="summary-item">
              <div class="summary-text">
                <h4>{{ headings.length }} titres extraits</h4>
                <h4>{{ paragraphs.length }} paragraphes extraits</h4>
              </div>
            </div>
          </div>
          
          <button @click="goToDetailPage" class="view-detail-btn">
            Voir la mise en page détaillée
          </button>
        </div>
      </div>
      
      <div class="preview-section">
        <div v-if="headings.length > 0" class="card preview-card">
          <div class="card-header">
            <h3>Aperçu des titres</h3>
          </div>
          <div class="card-body">
            <ul class="headings-list">
              <li
                v-for="(heading, index) in headings.slice(0, 5)"
                :key="index">
                <span>{{ heading.level }}: <strong>{{ heading.text }}</strong></span>
              </li>
            </ul>
            <div v-if="headings.length > 5" class="more-content">
              + {{ headings.length - 5 }} autres titres...
            </div>
          </div>
        </div>
        
        <div v-if="paragraphs.length > 0" class="card preview-card">
          <div class="card-header">
            <h3>Aperçu des paragraphes</h3>
          </div>
          <div class="card-body">
            <div v-for="(paragraph, index) in paragraphs.slice(0, 3)" :key="index" class="paragraph-preview">
              <div class="paragraph-header">Paragraphe {{ index + 1 }}</div>
              <p class="paragraph-text">{{ paragraph.length > 200 ? paragraph.substring(0, 200) + '...' : paragraph }}</p>
            </div>
            <div v-if="paragraphs.length > 3" class="more-content">
              + {{ paragraphs.length - 3 }} autres paragraphes...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Désactiver explicitement toutes les transitions pour éviter les effets de mouvement indésirables */
* {
  transition: none !important;
  transform: none !important;
}

.scrap-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.scrap-header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2d3748;
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  
  /* Explicitement désactiver les transformations et transitions */
  transform: none !important;
  transition: none !important;
}

/* Neutraliser explicitement les états de survol potentiels */
.card:hover, .option-card:hover, .view-detail-btn:hover, .extract-btn:hover {
  transform: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  background-color: inherit !important;
  border-color: inherit !important;
}

.url-card {
  border-left: 4px solid #3182ce;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.card-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.url-input-container {
  margin-bottom: 16px;
}

.url-input-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
}

.url-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.url-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);
}

.error-input {
  border-color: #e53e3e;
  background-color: #fff5f5;
}

.error-message {
  margin-top: 8px;
  color: #e53e3e;
  font-size: 14px;
}

.info-box {
  padding: 12px 16px;
  background-color: #ebf8ff;
  border-radius: 8px;
  margin-bottom: 24px;
}

.info-box p {
  margin: 0;
  color: #2c5282;
  font-size: 14px;
}

.extraction-options {
  margin-bottom: 24px;
}

.extraction-options h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #2d3748;
  font-weight: 600;
}

.options-container {
  display: flex;
  gap: 16px;
}

.option-card {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.option-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

.option-text p {
  margin: 0;
  font-size: 14px;
  color: #718096;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s; /* Conserver cette transition pour l'interrupteur */
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s; /* Conserver cette transition pour l'interrupteur */
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3182ce;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px) !important; /* Allow this transform */
}

.extract-btn {
  width: 100%;
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.extract-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.error-alert {
  padding: 16px;
  background-color: #fff5f5;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #e53e3e;
}

.alert-content h4 {
  margin: 0 0 4px 0;
  color: #c53030;
  font-size: 16px;
  font-weight: 600;
}

.alert-content p {
  margin: 0;
  color: #e53e3e;
  font-size: 14px;
}

.results-section {
  margin-top: 32px;
  scroll-margin-top: 20px; /* Marge pour le scroll automatique */
}

.summary-card {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.summary-content {
  margin-bottom: 20px;
}

.summary-text h4 {
  margin: 8px 0;
  color: #2c5282;
  font-size: 18px;
  font-weight: 600;
}

.view-detail-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
}

.preview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.headings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.headings-list li {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.headings-list li:last-child {
  border-bottom: none;
}

.paragraph-preview {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.paragraph-preview:last-child {
  border-bottom: none;
}

.paragraph-header {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dotted #e2e8f0;
}

.paragraph-text {
  margin: 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
}

.more-content {
  text-align: center;
  padding: 12px;
  color: #718096;
  font-style: italic;
  font-size: 14px;
  background-color: #f7fafc;
  border-top: 1px dashed #e2e8f0;
}

@media (max-width: 768px) {
  .options-container {
    flex-direction: column;
  }
  
  .preview-section {
    grid-template-columns: 1fr;
  }
}
</style>r