<script setup>
import { computed, ref, watch } from 'vue';
import { useScrapStore } from '../stores/scrapStore'; // Ajustez le chemin si nécessaire

// Initialiser le store
const scrapStore = useScrapStore();

// URL saisie par l'utilisateur
const url = ref(''); // URL par défaut

// Utilisation des options du store via refs locales pour le binding
const scrapHeadings = ref(scrapStore.scrapeOptions.headings);
const scrapParagraphs = ref(scrapStore.scrapeOptions.paragraphs);

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

// Import du router
import { useRouter } from 'vue-router';
const router = useRouter();

// Fonction pour déclencher le scraping
const fetchScrapData = async () => {
  const success = await scrapStore.fetchScrapData(url.value);
  
  // Si le scraping a réussi et qu'on a des données, proposer d'aller à la page de détail
  if (success && scrapStore.hasData) {
    // Attendre un peu pour que l'utilisateur voit que le scraping a bien fonctionné
    setTimeout(() => {
      router.push('/detail');
    }, 1000);
  }
};
</script>

<template>
  <div class="container">
    <h1>Scraping de sites web</h1>
    
    <!-- Champ pour entrer l'URL -->
    <div class="url-input">
      <label for="url-input">URL à scraper :</label>
      <input 
        id="url-input"
        v-model="url" 
        type="url" 
        placeholder="Entrez l'URL du site à scraper" 
        class="input-field"
      />
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
      :disabled="isLoading"
    >
      {{ isLoading ? 'Scraping en cours...' : 'Lancer le scraping' }}
    </button>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- le nombres de paragraphes récupérés -->
    <div v-if="paragraphs.length > 0" class="success-message">
      {{ paragraphs.length }} paragraphes récupérés !
    </div>

    <div v-if="headings.length > 0" class="success-message">
      {{ headings.length }} titres récupérés !
    </div>

    <div v-if="headings.length > 0 || paragraphs.length > 0" class="success-actions">
      <button @click="router.push('/detail')" class="view-detail-btn">
        Voir la mise en page détaillée
      </button>
    </div>
    
    <div class="cards">
      <div v-if="headings.length > 0" class="headings-container"> 
        <h2>Titres récupérés :</h2>
          <ul class="headings-list">
            <li
              v-for="(heading, index) in headings"
              :key="index"
              :class="'heading-' + heading.level.toLowerCase()">
              {{ heading.level }} :  <strong>{{ heading.text }}</strong>
            </li>
          </ul>
      </div>

      <div v-for="(paragraph, index) in paragraphs.slice(0, 5)" :key="index" class="card">
        <h3>Paragraphe {{ index + 1 }}</h3>
        <p>{{ paragraph }}</p>
      </div>
      
      <div v-if="paragraphs.length > 5" class="more-paragraphs">
        + {{ paragraphs.length - 5 }} autres paragraphes...
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.url-input {
  margin: 20px 0;
  text-align: left;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #007bff;
}

input:focus + .slider {
  box-shadow: 0 0 1px #007bff;
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
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 15px 0;
  font-size: 16px;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.success-message {
  margin: 20px 0;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-weight: bold;
}

.error-message {
  margin: 20px 0;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-weight: bold;
}

.headings-container {
  text-align: left;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.headings-list {
  list-style: none;
  padding: 0;
}

.heading-h1 {
  font-size: 22px;
  color: #007bff;
  font-weight: bold;
  margin-top: 15px;
}

.heading-h2 {
  font-size: 20px;
  color: #17a2b8;
  font-weight: bold;
  margin-left: 10px;
}

.heading-h3 {
  font-size: 18px;
  color: #28a745;
  margin-left: 20px;
}

.heading-h4 {
  font-size: 16px;
  color: #6c757d;
  margin-left: 30px;
}

.cards {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  /* text-align: left; */
}

.success-actions {
  margin: 20px 0;
}

.view-detail-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.view-detail-btn:hover {
  background-color: #218838;
}

.more-paragraphs {
  grid-column: 1 / -1;
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  color: #6c757d;
  border-radius: 8px;
  font-style: italic;
}
</style>