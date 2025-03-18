<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore'; // Ajustez le chemin si nécessaire

// Initialiser le store
const scrapStore = useScrapStore();
const router = useRouter();

// URL saisie par l'utilisateur
const url = ref(scrapStore.url);

// Utilisation des options du store via refs locales pour le binding
const scrapHeadings = ref(scrapStore.scrapeOptions.headings);
const scrapParagraphs = ref(scrapStore.scrapeOptions.paragraphs);

// Timeout de chargement
const loadingTimeout = ref(null);

// Observer les changements des toggles et mettre à jour le store
watch(scrapHeadings, (newValue) => {
  scrapStore.setScrapOptions({ headings: newValue });
});

watch(scrapParagraphs, (newValue) => {
  scrapStore.setScrapOptions({ paragraphs: newValue });
});

// Récupérer l'état depuis le store pour l'affichage
const paragraphs = computed(() => scrapStore.paragraphs);
const headings = computed(() => scrapStore.headings);
const isLoading = computed(() => scrapStore.isLoading);
const error = computed(() => scrapStore.error);

// Validation de l'URL
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

// Fonction pour déclencher le scraping
const fetchScrapData = async () => {
  if (!canSubmit.value) return;
  
  // Arrêter tout timeout existant
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
  
  // Configurer un timeout pour l'UI en cas de problème
  loadingTimeout.value = setTimeout(() => {
    if (isLoading.value) {
      scrapStore.setError("La requête prend plus de temps que prévu. Vérifiez votre connexion ou l'URL.");
      scrapStore.setLoading(false);
    }
  }, 45000); // 45 secondes
  
  await scrapStore.fetchScrapData(url.value);
  
  // Nettoyer le timeout après la requête
  clearTimeout(loadingTimeout.value);
  loadingTimeout.value = null;
};

// Fonction pour aller à la page de détail
const goToDetailPage = () => {
  router.push('/detail');
};

// Nettoyage du timeout lorsque le composant est détruit
onBeforeUnmount(() => {
  if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
});
</script>

<template>
  <div class="container">
    <h1>Scraping de Wikipedia</h1>
    
    <!-- Champ pour entrer l'URL -->
    <div class="url-input">
      <label for="url-input">URL à scraper :</label>
      <input 
        id="url-input"
        v-model="url" 
        type="url" 
        placeholder="Entrez l'URL d'une page Wikipedia" 
        class="input-field"
        :class="{'error-input': urlError}"
      />
      <div v-if="urlError" class="url-error-message">{{ urlError }}</div>
    </div>
    
    <!-- Instructions d'utilisation -->
    <div class="usage-tip">
      <i class="info-icon">ℹ️</i> 
      Exemple: https://fr.wikipedia.org/wiki/France
    </div>
    
    <!-- Options de scraping -->
    <div class="scraping-options">
      <div class="toggle-option">
        <label for="headings-toggle">Récupérer les titres</label>
        <label class="switch">
          <input id="headings-toggle" type="checkbox" v-model="scrapHeadings">
          <span class="slider round"></span>
        </label>
      </div>
      
      <div class="toggle-option">
        <label for="paragraphs-toggle">Récupérer les paragraphes</label>
        <label class="switch">
          <input id="paragraphs-toggle" type="checkbox" v-model="scrapParagraphs">
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    
    <!-- Bouton pour lancer le scraping -->
    <button 
      @click="fetchScrapData" 
      class="btn" 
      :disabled="!canSubmit || isLoading"
      :class="{'btn-disabled': !canSubmit}"
    >
      <span v-if="isLoading" class="loading-spinner"></span>
      {{ isLoading ? 'Scraping en cours...' : 'Lancer le scraping' }}
    </button>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-message">
      <i class="error-icon">⚠️</i> {{ error }}
    </div>

    <!-- Résumé des données récupérées -->
    <div v-if="headings.length > 0" class="success-message">
      <i class="success-icon"></i> {{ headings.length }} titres récupérés !
    </div>

    <div v-if="paragraphs.length > 0" class="success-message">
      <i class="success-icon"></i> {{ paragraphs.length }} paragraphes récupérés !
    </div>

    <!-- Actions supplémentaires -->
    <div v-if="headings.length > 0 || paragraphs.length > 0" class="success-actions">
      <button @click="goToDetailPage" class="view-detail-btn">
        Voir la mise en page détaillée
      </button>
    </div>
    
    <!-- Aperçu des données récupérées -->
    <div class="cards">
      <div v-if="headings.length > 0" class="headings-container"> 
        <h2>Titres récupérés (aperçu) :</h2>
          <ul class="headings-list">
            <li
              v-for="(heading, index) in headings.slice(0, 5)"
              :key="index"
              :class="'heading-' + heading.level.toLowerCase()">
              {{ heading.level }} :  <strong>{{ heading.text }}</strong>
            </li>
            <li v-if="headings.length > 5" class="more-items">
              + {{ headings.length - 5 }} autres titres...
            </li>
          </ul>
      </div>

      <div v-if="paragraphs.length > 0" class="paragraphs-container">
        <h2>Paragraphes récupérés (aperçu) :</h2>
        <div v-for="(paragraph, index) in paragraphs.slice(0, 3)" :key="index" class="card">
          <h3>Paragraphe {{ index + 1 }}</h3>
          <p>{{ paragraph.length > 150 ? paragraph.substring(0, 150) + '...' : paragraph }}</p>
        </div>
        
        <div v-if="paragraphs.length > 3" class="more-paragraphs">
          + {{ paragraphs.length - 3 }} autres paragraphes...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/base.css"; /* Utilise l'alias @ qui pointe vers src */


.container {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: var(--black);
}

h1, h2, h3 {
  color: var(--primary-dark);
}

.url-input {
  margin: 20px 0;
  text-align: left;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid var(--gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  transition: border-color var(--transition-speed);
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 3px var(--primary-light);
}

.error-input {
  border-color: var(--danger);
  background-color: var(--danger-light);
}

.url-error-message {
  color: var(--danger);
  font-size: 14px;
  margin-top: 5px;
}

.usage-tip {
  background-color: var(--primary-light);
  padding: 10px;
  border-radius: var(--border-radius);
  margin: 15px 0;
  text-align: left;
  font-size: 14px;
  color: var(--info);
  border-left: 4px solid var(--primary);
}

.info-icon {
  margin-right: 5px;
}

.scraping-options {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Style pour le switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray);
  transition: var(--transition-speed);
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: var(--white);
  transition: var(--transition-speed);
}

input:checked + .slider {
  background-color: var(--primary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.btn {
  background-color: var(--primary);
  color: var(--white);
  padding: 10px 15px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin: 15px 0;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  transition: background-color var(--transition-speed);
  font-weight: 600;
}

.btn:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--box-shadow);
}

.btn:disabled {
  background-color: var(--gray);
  cursor: not-allowed;
}

.btn-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin: 10px 0;
  padding: 12px;
  background-color: var(--danger-light);
  color: var(--danger);
  border-radius: var(--border-radius);
  font-weight: bold;
  display: flex;
  align-items: center;
  border-left: 4px solid var(--danger);
}

.success-message {
  margin: 10px 0;
  padding: 12px;
  background-color: var(--cta-light);
  color: var(--success);
  border-radius: var(--border-radius);
  font-weight: bold;
  display: flex;
  align-items: center;
  border-left: 4px solid var(--cta);
}

.success-icon, .error-icon {
  margin-right: 8px;
}

.success-actions {
  margin: 20px 0;
}

.view-detail-btn {
  background-color: var(--cta);
  color: var(--white);
  padding: 10px 15px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-speed);
  font-weight: 600;
}

.view-detail-btn:hover {
  background-color: var(--cta-dark);
  box-shadow: var(--box-shadow);
}

.cards {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.headings-container, .paragraphs-container {
  background-color: var(--secondary-light);
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--box-shadow);
}

.headings-list {
  list-style-type: none;
  padding-left: 0;
  text-align: left;
}

.headings-list li {
  padding: 8px 0;
  border-bottom: 1px solid var(--gray);
}

.heading-h1 {
  font-size: 1.2em;
  color: var(--primary-dark);
}

.heading-h2 {
  font-size: 1.1em;
  color: var(--primary);
}

.heading-h3, .heading-h4, .heading-h5, .heading-h6 {
  font-size: 1em;
  color: var(--secondary);
}

.more-items {
  text-align: center;
  font-style: italic;
  color: var(--secondary);
  margin-top: 10px;
  border-bottom: none !important;
}

.card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: var(--box-shadow);
  text-align: left;
}

.card h3 {
  margin-top: 0;
  color: var(--primary);
  font-size: 1.1em;
  border-bottom: 1px solid var(--gray);
  padding-bottom: 8px;
}

.card p {
  margin-bottom: 0;
  color: var(--dark-gray);
  line-height: 1.5;
}

.more-paragraphs {
  text-align: center;
  font-style: italic;
  color: var(--secondary);
  margin-top: 10px;
}

/* Responsive design */
@media (max-width: 600px) {
  .scraping-options {
    flex-direction: column;
    gap: 15px;
  }
  
  .toggle-option {
    justify-content: space-between;
    width: 100%;
  }
}
</style>