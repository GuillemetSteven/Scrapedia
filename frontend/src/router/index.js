// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Importation des composants de pages
import Home from "../components/Home.vue"; // Page d'accueil (à créer)
import Scrap from "../components/Scrap.vue"; // Ajustez le chemin si nécessaire
import ScrapDetail from "../components/ScrapDetail.vue"; // Nous allons créer ce composant

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

export default router;
