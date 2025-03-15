// src/stores/scrapStore.js
import axios from "axios";
import { defineStore } from "pinia";

export const useScrapStore = defineStore("scrap", {
  // État initial
  state: () => ({
    url: "",
    headings: [],
    paragraphs: [],
    isLoading: false,
    error: null,
    scrapeOptions: {
      headings: true,
      paragraphs: true,
    },
    // Pour suivre l'historique des sites scrapés
    scrapHistory: [],
  }),

  // Getters
  getters: {
    // Compter le nombre total d'éléments récupérés
    totalScrapedElements: (state) => state.headings.length + state.paragraphs.length,

    // Savoir si nous avons des données
    hasData: (state) => state.headings.length > 0 || state.paragraphs.length > 0,
  },

  // Actions
  actions: {
    // Action pour scraper les données
    async fetchScrapData(url) {
      this.isLoading = true;
      this.error = null;

      try {
        // Construire l'URL avec tous les paramètres
        const requestUrl = `http://localhost:3000/scrap?url=${encodeURIComponent(url)}&headings=${
          this.scrapeOptions.headings
        }&paragraphs=${this.scrapeOptions.paragraphs}`;

        const response = await axios.get(requestUrl);

        // Mettre à jour l'état avec les données récupérées
        this.url = url;
        this.headings = response.data.headings || [];
        this.paragraphs = response.data.paragraphs || [];

        // Ajouter à l'historique si pas déjà présent
        if (!this.scrapHistory.some((item) => item.url === url)) {
          this.scrapHistory.push({
            url,
            timestamp: new Date().toISOString(),
            elementsCount: this.totalScrapedElements,
          });
        }

        return true;
      } catch (error) {
        this.error = error.response?.data?.error || "Une erreur est survenue lors du scraping";
        console.error("Erreur lors du scraping:", error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Action pour définir les options de scraping
    setScrapOptions(options) {
      this.scrapeOptions = {
        ...this.scrapeOptions,
        ...options,
      };
    },

    // Action pour effacer les données
    clearData() {
      this.headings = [];
      this.paragraphs = [];
      this.error = null;
    },
  },
});
