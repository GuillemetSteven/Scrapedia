<script setup>
import { useRouter } from 'vue-router';
import ScrapHistory from './ScrapHistory.vue'; // Importation du composant d'historique

const router = useRouter();

// Fonction pour naviguer vers la page de scraping
const goToScrapPage = () => {
  router.push('/scrap');
};
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>Web Scraper</h1>
      <p class="subheading">Un outil pour extraire et analyser des données de sites web</p>
      
      <div class="action-buttons">
        <button @click="goToScrapPage" class="primary-btn">
          Commencer un nouveau scraping
        </button>
      </div>
    </div>
    
    <div class="features-section">
      <div class="feature-card">
        <h3>Extraction de données</h3>
        <p>Récupérez facilement les titres et paragraphes de n'importe quel site web.</p>
      </div>
      
      <div class="feature-card">
        <h3>Personnalisation</h3>
        <p>Choisissez précisément quelles informations vous souhaitez extraire.</p>
      </div>
      
      <div class="feature-card">
        <h3>Historique</h3>
        <p>Consultez et réutilisez vos scrapings précédents en un clic.</p>
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
  margin-bottom: 30px;
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
  margin-top: 20px;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-btn:hover {
  background-color: #0056b3;
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
</style>