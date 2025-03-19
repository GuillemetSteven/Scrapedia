<script setup>
import { useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore';
import { useScrapStore } from '../stores/scrapStore';
import ScrapHistory from './ScrapHistory.vue';

const router = useRouter();
const scrapStore = useScrapStore();
const llmStore = useLlmStore();

// Fonction pour naviguer vers la page de scraping
const goToScrapPage = () => {
  router.push('/scrap');
};

// Fonction pour naviguer vers la page de génération IA
const goToGeneratePage = () => {
  router.push('/generate');
};

// Fonction pour naviguer vers les résultats
const goToResultsPage = () => {
  router.push('/results');
};

// Vérifier si nous avons des données pour la génération
const hasScrapedData = scrapStore.hasData;
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>Web Scraper & Générateur IA</h1>
      <p class="subheading">Un outil pour extraire, analyser et transformer des données web</p>
      
      <div class="action-buttons">
        <button @click="goToScrapPage" class="primary-btn">
          Scraper des données
        </button>
        <button 
          @click="goToGeneratePage" 
          class="secondary-btn"
          :disabled="!hasScrapedData"
          :title="!hasScrapedData ? 'Vous devez d\'abord scraper des données' : ''"
        >
          Générer avec IA
        </button>
        <button @click="goToResultsPage" class="tertiary-btn">
          Voir les résultats
        </button>
      </div>
    </div>
    
    <div class="workflow-section">
      <h2>Comment ça marche</h2>
      
      <div class="workflow-steps">
        <div class="workflow-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Extraction de données</h3>
            <p>Saisissez l'URL du site web que vous souhaitez analyser. L'outil récupérera automatiquement les titres et paragraphes pertinents.</p>
          </div>
        </div>
        
        <div class="workflow-connector"></div>
        
        <div class="workflow-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Génération IA</h3>
            <p>Utilisez les données extraites pour générer un nouveau contenu avec l'IA. Définissez vos instructions précises pour le texte à créer.</p>
          </div>
        </div>
        
        <div class="workflow-connector"></div>
        
        <div class="workflow-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Résultats formatés</h3>
            <p>Consultez et utilisez le contenu généré dans un format structuré et élégant. Tous vos résultats sont sauvegardés pour un accès ultérieur.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="feature-card">
        <h3>Extraction ciblée</h3>
        <p>Sélectionnez précisément quelles informations extraire du site web (titres, paragraphes).</p>
      </div>
      
      <div class="feature-card">
        <h3>Prompts personnalisés</h3>
        <p>Définissez exactement comment l'IA doit transformer le contenu extrait selon vos besoins.</p>
      </div>
      
      <div class="feature-card">
        <h3>Historique complet</h3>
        <p>Retrouvez facilement l'ensemble de vos extractions et générations précédentes.</p>
      </div>
    </div>
    
    <!-- Intégration du composant d'historique -->
    <ScrapHistory />
  </div>
</template>

<style scoped>


@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap');


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans', 'Noto Sans JP', sans-serif;
  background-color: #f8f9fa;
  color: #1d3557; 
  line-height: 1.6;
}


.home-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}


.hero-section {
  text-align: center;
  padding: 60px 30px;
  border-radius: 12px;
  background-color: #f5f5f0; 
  margin-bottom: 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #1d3557, #2a9d8f, #1d3557);
}

h1 {
  font-size: 2.8em;
  color: #1d3557;
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subheading {
  font-size: 1.3em;
  color: #495057;
  margin-bottom: 40px;
  font-weight: 300;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Button Styles */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn, .tertiary-btn {
  padding: 14px 28px;
  font-size: 1em;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}


.primary-btn:hover, .secondary-btn:hover, .tertiary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.primary-btn:active, .secondary-btn:active, .tertiary-btn:active {
  transform: translateY(1px);
}

.primary-btn {
  background-color: #1d3557; /* Primary deep navy */
  color: white;
}

.primary-btn:hover {
  background-color: #152638;
}

.secondary-btn {
  background-color: #2a9d8f; /* Teal call-to-action */
  color: white;
}

.secondary-btn:hover {
  background-color: #208b7f;
}

.secondary-btn:disabled {
  background-color: #a2d5cf;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tertiary-btn {
  background-color: #e9ecef;
  color: #1d3557;
  border: 1px solid #dee2e6;
}

.tertiary-btn:hover {
  background-color: #dee2e6;
}


.workflow-section {
  margin-bottom: 70px;
}

h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #1d3557;
  font-size: 2.2em;
  font-weight: 700;
  position: relative;
  padding-bottom: 12px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #2a9d8f;
}

.workflow-steps {
  display: flex;
  gap: 24px;
  margin-top: 30px;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  flex: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.workflow-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #1d3557;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.step-content {
  text-align: center;
}

.step-content h3 {
  color: #1d3557;
  margin-bottom: 15px;
  font-size: 1.4em;
}

.step-content p {
  color: #495057;
  font-size: 0.95em;
  line-height: 1.6;
}

.workflow-connector {
  display: none;
}


.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 60px;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background-color: #2a9d8f;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card h3 {
  color: #1d3557;
  margin-bottom: 15px;
  font-size: 1.3em;
  font-weight: 600;
}

.feature-card p {
  color: #495057;
  font-size: 0.95em;
}


@media (max-width: 768px) {
  .workflow-steps {
    flex-direction: column;
  }
  
  h1 {
    font-size: 2.3em;
  }
  
  .subheading {
    font-size: 1.1em;
  }
  
  .hero-section {
    padding: 40px 20px;
  }
  
  .primary-btn, .secondary-btn, .tertiary-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
}

.history-section {
  margin-top: 60px;
}

.history-section h2 {
  margin-bottom: 30px;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.history-item {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.history-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.history-date {
  font-size: 0.85em;
  color: #6c757d;
  margin-bottom: 8px;
}

.history-title {
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 10px;
}

.history-details {
  color: #495057;
  font-size: 0.9em;
}

.load-more-btn {
  background-color: transparent;
  border: 1px solid #1d3557;
  color: #1d3557;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.load-more-btn:hover {
  background-color: #1d3557;
  color: white;
}


@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.home-container > * {
  animation: fadeIn 0.5s ease forwards;
}

.hero-section {
  animation-delay: 0.1s;
}

.workflow-section {
  animation-delay: 0.2s;
}

.features-section {
  animation-delay: 0.3s;
}


button:focus, a:focus {
  outline: 2px solid #2a9d8f;
  outline-offset: 2px;
}
</style>