<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore';

const router = useRouter();
const scrapStore = useScrapStore();

// Pour le bouton de retour en haut
const showScrollButton = ref(false);
const scrollThreshold = 300;

// Récupérer les données du store
const url = computed(() => scrapStore.url);
const headings = computed(() => scrapStore.headings);
const paragraphs = computed(() => scrapStore.paragraphs);

// Vérifier si nous avons des données à afficher
const hasData = computed(() => headings.value.length > 0 || paragraphs.value.length > 0);

// Gérer l'affichage du bouton de retour en haut
const handleScroll = () => {
  showScrollButton.value = window.scrollY > scrollThreshold;
};

onMounted(() => {
  if (!hasData.value) {
    router.push('/scrap');
  }
  
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Fonction pour retourner à la page de scraping
const goBack = () => {
  router.push('/scrap');
};

// Fonction pour retourner en haut de la page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Fonction modifiée pour ne pas altérer les tableaux originaux
const formattedContent = computed(() => {
  const content = [];
  // Faire des copies des tableaux pour éviter de les modifier
  const headingsCopy = [...headings.value];
  const paragraphsCopy = [...paragraphs.value];
  let paragraphIndex = 0;
  
  // Organiser le contenu: ajouter d'abord les titres H1, puis les paragraphes jusqu'au prochain H1, etc.
  const h1Headings = headingsCopy.filter(h => h.level === 'H1');
  
  if (h1Headings.length > 0) {
    // Pour chaque titre H1, récupérer tous les éléments sous ce titre
    h1Headings.forEach(h1 => {
      content.push({ type: 'heading', level: 1, text: h1.text });
      
      // Trouver tous les titres et paragraphes après ce H1
      const h1Index = headingsCopy.findIndex(h => h.level === 'H1' && h.text === h1.text);
      const nextH1Index = headingsCopy.findIndex((h, i) => i > h1Index && h.level === 'H1');
      
      // Limite de l'index de fin
      const endIndex = nextH1Index !== -1 ? nextH1Index : headingsCopy.length;
      
      // Ajouter tous les sous-titres (H2, H3, H4) et paragraphes
      for (let i = h1Index + 1; i < endIndex; i++) {
        const heading = headingsCopy[i];
        const level = parseInt(heading.level.substring(1));
        content.push({ type: 'heading', level, text: heading.text });
        
        // Ajouter un paragraphe après chaque sous-titre si disponible
        if (paragraphIndex < paragraphsCopy.length) {
          const paragraph = paragraphsCopy[paragraphIndex++];
          content.push({ type: 'paragraph', text: paragraph });
        }
      }
    });
  } else {
    // S'il n'y a pas de H1, ajouter simplement les paragraphes
    paragraphsCopy.forEach(p => {
      content.push({ type: 'paragraph', text: p });
    });
  }
  
  return content;
});

// Extraire le nom d'hôte de l'URL pour l'affichage
const hostname = computed(() => {
  // Utiliser l'URL complète pour l'affichage
const fullUrl = computed(() => {
  return url.value;
});
});
</script>

<template>
  <div class="detail-container">
    <div class="detail-header">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        <span>Retour</span>
      </button>
      <div class="page-info">
        <h1>Contenu extrait</h1>
        <div class="url-display">
          <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span class="url-text">{{ fullUrl }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="hasData" class="article-container">
      <div v-for="(item, index) in formattedContent" :key="index" class="content-item">
        <h1 v-if="item.type === 'heading' && item.level === 1" class="heading-1">{{ item.text }}</h1>
        <h2 v-else-if="item.type === 'heading' && item.level === 2" class="heading-2">{{ item.text }}</h2>
        <h3 v-else-if="item.type === 'heading' && item.level === 3" class="heading-3">{{ item.text }}</h3>
        <h4 v-else-if="item.type === 'heading' && item.level === 4" class="heading-4">{{ item.text }}</h4>
        <p v-else-if="item.type === 'paragraph'" class="paragraph">{{ item.text }}</p>
      </div>
    </div>
    
    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Aucune donnée disponible. Redirection vers la page de scraping...</p>
    </div>
    
    <!-- Bouton pour remonter en haut de la page -->
    <button 
      v-show="showScrollButton" 
      @click="scrollToTop" 
      class="scroll-top-btn"
      aria-label="Retour en haut"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="arrow-up-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  min-height: calc(100vh - 40px);
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  flex-shrink: 0;
}

.back-icon {
  width: 16px;
  height: 16px;
}

.page-info {
  flex: 1;
}

h1 {
  color: #2d3748;
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
}

.url-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
}

.link-icon {
  width: 16px;
  height: 16px;
}

.url-text {
  font-family: monospace;
  word-break: break-all;
  color: #4a5568;
  background-color: #edf2f7;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.article-container {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.content-item {
  margin-bottom: 24px;
}

.heading-1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
  line-height: 1.3;
}

.heading-2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 32px 0 16px 0;
  line-height: 1.4;
}

.heading-3 {
  font-size: 1.25rem;
  color: #4a5568;
  margin: 24px 0 16px 0;
  line-height: 1.4;
}

.heading-4 {
  font-size: 1.125rem;
  color: #718096;
  margin: 20px 0 12px 0;
  line-height: 1.4;
  font-weight: 600;
}

.paragraph {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.7;
  margin: 0 0 20px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(49, 130, 206, 0.2);
  border-radius: 50%;
  border-top-color: #3182ce;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #718096;
  font-size: 16px;
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3182ce;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.arrow-up-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .back-btn {
    width: 100%;
    justify-content: center;
  }
  
  .article-container {
    padding: 24px 20px;
  }
  
  .heading-1 {
    font-size: 1.75rem;
  }
  
  .heading-2 {
    font-size: 1.35rem;
  }
  
  .heading-3 {
    font-size: 1.15rem;
  }
  
  .scroll-top-btn {
    width: 44px;
    height: 44px;
    bottom: 20px;
    right: 20px;
  }
  
  .arrow-up-icon {
    width: 20px;
    height: 20px;
  }
}
</style>