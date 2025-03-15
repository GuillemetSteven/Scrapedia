// src/main.js
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Importation des composants pour les routes
import Home from "./components/Home.vue"; // Ajustez le chemin selon votre structure
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

// Configuration du router (IMPORTANT!)
app.use(router);

// Monter l'application
app.mount("#app");
