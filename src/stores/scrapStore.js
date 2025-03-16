// src/stores/scrapStore.js
import axios from "axios";
import { defineStore } from "pinia";

// Fonction pour charger les données depuis localStorage
const loadStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem("scrapStore");
    return savedState ? JSON.parse(savedState) : null;
  } catch (e) {
    console.error("Erreur lors du chargement du state:", e);
    return null;
  }
};

// État initial, chargé depuis localStorage si disponible
const savedState = loadStateFromStorage();

export const useScrapStore = defineStore("scrap", {
  // État initial avec les valeurs sauvegardées ou par défaut
  state: () => ({
    url: savedState?.url || "",
    headings: savedState?.headings || [],
    paragraphs: savedState?.paragraphs || [],
    isLoading: false,
    error: null,
    scrapeOptions: savedState?.scrapeOptions || {
      headings: true,
      paragraphs: true,
    },
    scrapHistory: savedState?.scrapHistory || [],
  }),

  // Getters
  getters: {
    totalScrapedElements: (state) => state.headings.length + state.paragraphs.length,
    hasData: (state) => state.headings.length > 0 || state.paragraphs.length > 0,
  },

  // Actions
  actions: {
    // Sauvegarder l'état dans localStorage
    saveState() {
      const stateToSave = {
        url: this.url,
        headings: this.headings,
        paragraphs: this.paragraphs,
        scrapeOptions: this.scrapeOptions,
        scrapHistory: this.scrapHistory,
      };

      localStorage.setItem("scrapStore", JSON.stringify(stateToSave));
    },

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
        const existingIndex = this.scrapHistory.findIndex((item) => item.url === url);
        if (existingIndex >= 0) {
          // Mettre à jour l'élément existant
          this.scrapHistory[existingIndex] = {
            url,
            timestamp: new Date().toISOString(),
            elementsCount: this.totalScrapedElements,
          };
        } else {
          // Ajouter un nouvel élément
          this.scrapHistory.push({
            url,
            timestamp: new Date().toISOString(),
            elementsCount: this.totalScrapedElements,
          });
        }

        // Sauvegarder dans localStorage
        this.saveState();

        return true;
      } catch (error) {
        this.error = error.response?.data?.error || "Une erreur est survenue lors du scraping";
        console.error("Erreur lors du scraping:", error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Action pour rescraper une URL depuis l'historique
    async rescrapUrl(url) {
      return await this.fetchScrapData(url);
    },

    // Action pour définir les options de scraping
    setScrapOptions(options) {
      this.scrapeOptions = {
        ...this.scrapeOptions,
        ...options,
      };
      this.saveState();
    },

    // Action pour effacer les données
    clearData() {
      this.headings = [];
      this.paragraphs = [];
      this.error = null;
      this.saveState();
    },
  },
});
