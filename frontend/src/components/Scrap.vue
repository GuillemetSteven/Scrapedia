<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
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
          <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>Exemple: https://fr.wikipedia.org/wiki/France</p>
        </div>
        
        <div class="extraction-options">
          <h3>Options d'extraction</h3>
          <div class="options-container">
            <div class="option-card">
              <div class="option-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 7V4h16v3"></path>
                  <path d="M9 20h6"></path>
                  <path d="M12 4v16"></path>
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
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
          :class="{'is-loading': isLoading}"
        >
          <span v-if="!isLoading">Extraire le contenu</span>
          <span v-else class="loading-text">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            Extraction en cours
          </span>
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-alert">
      <div class="alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
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
          <div class="summary-header">
            <h3>Extraction réussie!</h3>
          </div>
          <div class="summary-content">
            <div class="summary-item">
              <div class="summary-stats">
                <div class="stat-box">
                  <span class="stat-number">{{ headings.length }}</span>
                  <span class="stat-label">titres</span>
                </div>
                <div class="stat-box">
                  <span class="stat-number">{{ paragraphs.length }}</span>
                  <span class="stat-label">paragraphes</span>
                </div>
              </div>
            </div>
          </div>
          
          <button @click="goToDetailPage" class="view-detail-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Voir la mise en page détaillée
          </button>
        </div>
      </div>
      
      <div class="preview-section">
        <div v-if="headings.length > 0" class="card preview-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 7V4h16v3"></path>
              <path d="M9 20h6"></path>
              <path d="M12 4v16"></path>
            </svg>
            <h3>Aperçu des titres</h3>
          </div>
          <div class="card-body">
            <ul class="headings-list">
              <li
                v-for="(heading, index) in headings.slice(0, 5)"
                :key="index"
                class="preview-item"
              >
                <span class="heading-level">{{ heading.level }}</span>
                <span class="heading-text">{{ heading.text }}</span>
              </li>
            </ul>
            <div v-if="headings.length > 5" class="more-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
              + {{ headings.length - 5 }} autres titres
            </div>
          </div>
        </div>
        
        <div v-if="paragraphs.length > 0" class="card preview-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3>Aperçu des paragraphes</h3>
          </div>
          <div class="card-body">
            <div v-for="(paragraph, index) in paragraphs.slice(0, 3)" :key="index" class="paragraph-preview preview-item">
              <div class="paragraph-header">Paragraphe {{ index + 1 }}</div>
              <p class="paragraph-text">{{ paragraph.length > 200 ? paragraph.substring(0, 200) + '...' : paragraph }}</p>
            </div>
            <div v-if="paragraphs.length > 3" class="more-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
              + {{ paragraphs.length - 3 }} autres paragraphes
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import des polices Google */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap');

.scrap-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Noto Sans', 'Noto Sans JP', sans-serif;
  color: #1d3557;
}

.scrap-header {
  text-align: center;
  margin-bottom: 35px;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

h1 {
  color: #1d3557;
  margin: 0 0 12px 0;
  font-size: 2.6em;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #495057;
  font-size: 1.15em;
  margin: 0;
  font-weight: 300;
}

.card {
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 28px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.url-card {
  border-left: 4px solid #2a9d8f;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-icon {
  width: 22px;
  height: 22px;
  margin-right: 10px;
  color: #2a9d8f;
}

.card-header h3 {
  margin: 0;
  color: #1d3557;
  font-size: 18px;
  font-weight: 600;
}

.card-body {
  padding: 24px;
}

.url-input-container {
  margin-bottom: 20px;
}

.url-input-container label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #1d3557;
  font-size: 16px;
}

.input-wrapper {
  position: relative;
}

.url-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #f8fafc;
  color: #1d3557;
  transition: all 0.3s ease;
}

.url-input:focus {
  outline: none;
  border-color: #2a9d8f;
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.2);
  background-color: white;
}

.error-input {
  border-color: #e53e3e;
  background-color: #fff5f5;
}

.error-message {
  margin-top: 8px;
  color: #e53e3e;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "!";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: #e53e3e;
  color: white;
  border-radius: 50%;
  margin-right: 8px;
  font-weight: bold;
  font-size: 12px;
}

.info-box {
  display: flex;
  align-items: center;
  padding: 15px 18px;
  background-color: #ebf8ff;
  border-radius: 10px;
  margin-bottom: 28px;
  border-left: 3px solid #3182ce;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #3182ce;
  margin-right: 12px;
  flex-shrink: 0;
}

.info-box p {
  margin: 0;
  color: #2c5282;
  font-size: 14px;
}

.extraction-options {
  margin-bottom: 28px;
}

.extraction-options h3 {
  margin: 0 0 18px 0;
  font-size: 18px;
  color: #1d3557;
  font-weight: 600;
}

.options-container {
  display: flex;
  gap: 20px;
}

.option-card {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  background-color: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.option-card:hover {
  background-color: #edf2f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e0;
}

.option-content {
  display: flex;
  align-items: center;
}

.option-icon {
  width: 24px;
  height: 24px;
  margin-right: 14px;
  color: #2a9d8f;
}

.option-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1d3557;
  font-weight: 600;
}

.option-text p {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
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
  transition: .4s;
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
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2a9d8f;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.extract-btn {
  width: 100%;
  background-color: #1d3557;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.extract-btn:hover:not(:disabled) {
  background-color: #152638;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(29, 53, 87, 0.2);
}

.extract-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.extract-btn.is-loading {
  background-color: #2a9d8f;
  cursor: wait;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
  margin-right: 4px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.error-alert {
  display: flex;
  padding: 16px;
  background-color: #fff5f5;
  border-radius: 12px;
  margin-bottom: 28px;
  border-left: 4px solid #e53e3e;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.1);
  animation: fadeIn 0.5s ease forwards;
}

.alert-icon {
  width: 24px;
  height: 24px;
  color: #e53e3e;
  margin-right: 16px;
  flex-shrink: 0;
}

.alert-content h4 {
  margin: 0 0 6px 0;
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
  margin-top: 40px;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  scroll-margin-top: 20px;
}

.summary-card {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.summary-header {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(49, 130, 206, 0.2);
}

.summary-header h3 {
  margin: 0;
  color: #2c5282;
  font-size: 20px;
  font-weight: 600;
}

.summary-content {
  padding: 20px 24px;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #2c5282;
}

.stat-label {
  font-size: 14px;
  color: #4a5568;
  margin-top: 4px;
}

.view-detail-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 24px 24px;
  width: calc(100% - 48px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-detail-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(49, 130, 206, 0.2);
}

.btn-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.preview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 30px;
}

.preview-card {
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.headings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.preview-item {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.preview-item:hover {
  background-color: #f7fafc;
}

.preview-item:last-child {
  border-bottom: none;
}

.heading-level {
  font-size: 13px;
  font-weight: 600;
  color: #2a9d8f;
  background-color: #e6fffa;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
}

.heading-text {
  font-weight: 500;
  color: #2d3748;
}

.paragraph-preview {
  padding: 16px;
}

.paragraph-header {
  font-size: 14px;
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px dotted #e2e8f0;
}

.paragraph-text {
  margin: 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
}

.more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  color: #4a5568;
  font-style: italic;
  font-size: 14px;
  background-color: #f7fafc;
  border-top: 1px dashed #e2e8f0;
}

.more-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .scrap-container {
    padding: 20px 16px;
  }
  
  h1 {
    font-size: 2.2em;
  }
  
  .options-container {
    flex-direction: column;
  }
  
  .preview-section {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    gap: 20px;
  }
}
</style>