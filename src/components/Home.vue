<script setup>
import { useRouter } from 'vue-router';
import { useLlmStore } from '../stores/llmStore';
import { useScrapStore } from '../stores/scrapStore';
import ScrapHistory from './ScrapHistory.vue'; // Ajustez le chemin si nécessaire

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
.home-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 40px 0;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h1 {
  font-size: 2.5em;
  color: #343a40;
  margin-bottom: 10px;
}

.subheading {
  font-size: 1.2em;
  color: #6c757d;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn, .tertiary-btn {
  padding: 12px 24px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.primary-btn {
  background-color: #007bff;
  color: white;
}

.primary-btn:hover {
  background-color: #0056b3;
}

.secondary-btn {
  background-color: #28a745;
  color: white;
}

.secondary-btn:hover {
  background-color: #218838;
}

.secondary-btn:disabled {
  background-color: #a7c9b4;
  cursor: not-allowed;
}

.tertiary-btn {
  background-color: #6c757d;
  color: white;
}

.tertiary-btn:hover {
  background-color: #5a6268;
}

.workflow-section {
  margin-bottom: 40px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #343a40;
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.workflow-step {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2em;
}

.step-content {
  flex: 1;
}

.workflow-connector {
  height: 20px;
  width: 2px;
  background-color: #dee2e6;
  margin-left: 20px;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-card h3 {
  color: #343a40;
  margin-bottom: 10px;
}

.feature-card p {
  color: #6c757d;
}

@media (min-width: 768px) {
  .workflow-steps {
    flex-direction: row;
    align-items: stretch;
  }
  
  .workflow-step {
    flex-direction: column;
    flex: 1;
  }
  
  .step-number {
    margin: 0 auto 15px;
  }
  
  .workflow-connector {
    height: 2px;
    width: 20px;
    margin: auto 0;
  }
}
</style>