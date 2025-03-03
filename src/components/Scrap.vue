<script setup>
import axios from 'axios';
import { ref } from 'vue';

const paragraphs = ref([]);
const headings = ref([]);

const fetchScrapData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/scrap');
    paragraphs.value = response.data.paragraphs; // Stocker les paragraphes récupérés
    headings.value = response.data.headings;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
};
</script>

<template>
  <div class="container">
    <h1>Scraping de Wikipedia</h1>
    <!-- Bouton pour lancer le scraping -->
    <button @click="fetchScrapData" class="btn">Lancer le scraping</button>

    <!-- le nombres de paragraphes récupérés -->
    <div v-if="paragraphs.length > 0" class="success-message">
      {{ paragraphs.length }} paragraphes récupérés !
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

      <div v-for="(paragraph, index) in paragraphs" :key="index" class="card">
        <h3>Paragraphe {{ index + 1 }}</h3>
        <p>{{ paragraph }}</p>
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

.success-message {
  margin: 20px 0;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
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


</style>
