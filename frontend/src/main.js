import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import "./assets/base.css";

// Importation des composants pour les routes
import Home from "./components/Home.vue";
import LlmGenerator from "./components/LlmGenerator.vue";
import LlmResultDetail from "./components/LlmResultDetail.vue";
import LlmResults from "./components/LlmResults.vue";
import Scrap from "./components/Scrap.vue";
import ScrapDetail from "./components/ScrapDetail.vue";

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
