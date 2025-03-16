// src/main.js
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Importation des composants pour les routes
import Home from "./components/Home.vue"; // Page d'accueil
import LlmGenerator from "./components/LlmGenerator.vue"; // Composant d'intégration LLM
import LlmResultDetail from "./components/LlmResultDetail.vue"; // Détail d'une génération
import LlmResults from "./components/LlmResults.vue"; // Liste des générations
import Scrap from "./components/Scrap.vue"; // Page de scraping
import ScrapDetail from "./components/ScrapDetail.vue"; // Visualisation des données scrapées

// Définition des routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/scrap",
    name: "Scrap",
    component: Scrap,
  },
  {
    path: "/detail",
    name: "ScrapDetail",
    component: ScrapDetail,
  },
  {
    path: "/generate",
    name: "LlmGenerator",
    component: LlmGenerator,
  },
  {
    path: "/results",
    name: "LlmResults",
    component: LlmResults,
  },
  {
    path: "/result/:id",
    name: "LlmResultDetail",
    component: LlmResultDetail,
  },
];

// Création du router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Création de l'application Vue
const app = createApp(App);

// Configuration de Pinia
const pinia = createPinia();
app.use(pinia);

// Configuration du router
app.use(router);

// Monter l'application
app.mount("#app");
