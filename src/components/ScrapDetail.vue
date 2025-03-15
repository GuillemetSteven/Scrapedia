<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useScrapStore } from '../stores/scrapStore'; // Ajustez le chemin si nécessaire

const router = useRouter();
const scrapStore = useScrapStore();

// Récupérer les données du store
const url = computed(() => scrapStore.url);
const headings = computed(() => scrapStore.headings);
const paragraphs = computed(() => scrapStore.paragraphs);

// Vérifier si nous avons des données à afficher
const hasData = computed(() => headings.value.length > 0 || paragraphs.value.length > 0);

// Rediriger vers la page de scraping si aucune donnée n'est disponible
onMounted(() => {
  if (!hasData.value) {
    router.push('/scrap');
  }
});

// Fonction pour retourner à la page de scraping
const goBack = () => {
  router.push('/scrap');
};

// Fonction pour transformer les données en un article structuré
const formattedContent = computed(() => {
  const content = [];
  
  // Organiser le contenu: ajouter d'abord les titres H1, puis les paragraphes jusqu'au prochain H1, etc.
  const h1Headings = headings.value.filter(h => h.level === 'H1');
  
  if (h1Headings.length > 0) {
    // Pour chaque titre H1, récupérer tous les éléments sous ce titre
    h1Headings.forEach(h1 => {
      content.push({ type: 'heading', level: 1, text: h1.text });
      
      // Trouver tous les titres et paragraphes après ce H1
      const h1Index = headings.value.findIndex(h => h.level === 'H1' && h.text === h1.text);
      const nextH1Index = headings.value.findIndex((h, i) => i > h1Index && h.level === 'H1');
      
      // Limite de l'index de fin
      const endIndex = nextH1Index !== -1 ? nextH1Index : headings.value.length;
      
      // Ajouter tous les sous-titres (H2, H3, H4) et paragraphes
      for (let i = h1Index + 1; i < endIndex; i++) {
        const heading = headings.value[i];
        const level = parseInt(heading.level.substring(1)); // Extraire le numéro (2 pour H2, etc.)
        content.push({ type: 'heading', level, text: heading.text });
        
        // Ajouter des paragraphes après chaque sous-titre
        if (paragraphs.value.length > 0) {
          // Ajouter un paragraphe (pour simplifier, on prend juste le premier paragraphe disponible)
          const paragraph = paragraphs.value.shift(); // Prendre et retirer le premier paragraphe
          if (paragraph) {
            content.push({ type: 'paragraph', text: paragraph });
          }
        }
      }
    });
  } else {
    // S'il n'y a pas de H1, ajouter simplement les paragraphes
    paragraphs.value.forEach(p => {
      content.push({ type: 'paragraph', text: p });
    });
  }
  
  return content;
});
</script>

<template>
  <div class="detail-container">
    <div class="detail-header">
      <button @click="goBack" class="back-btn">
        &larr; Retour
      </button>
      <h1>Contenu de {{ url }}</h1>
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
      Aucune donnée disponible. Redirection vers la page de scraping...
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #e9ecef;
}

.article-container {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.content-item {
  margin-bottom: 20px;
}

.heading-1 {
  font-size: 2em;
  color: #212529;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #dee2e6;
}

.heading-2 {
  font-size: 1.5em;
  color: #343a40;
  margin-bottom: 15px;
}

.heading-3 {
  font-size: 1.3em;
  color: #495057;
  margin-bottom: 10px;
}

.heading-4 {
  font-size: 1.1em;
  color: #6c757d;
  margin-bottom: 10px;
}

.paragraph {
  font-size: 1em;
  color: #212529;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
}
</style>