// src/stores/llmStore.js
import axios from "axios";
import { defineStore } from "pinia";

// Fonction pour charger les données depuis localStorage
const loadStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem("llmStore");
    return savedState ? JSON.parse(savedState) : null;
  } catch (e) {
    console.error("Erreur lors du chargement du state LLM:", e);
    return null;
  }
};

const savedState = loadStateFromStorage();

export const useLlmStore = defineStore("llm", {
  state: () => ({
    generations: savedState?.generations || [],
    currentGeneration: null,
    isLoading: false,
    error: null,
    // Configuration Ollama
    ollamaConfig: {
      baseUrl: "http://localhost:11434",
      // Utilisez le nom complet du modèle tel qu'indiqué dans ollama list
      model: "deepseek-r1:latest", // phi:latest
    },
  }),

  getters: {
    hasGenerations: (state) => state.generations.length > 0,
    getGenerationById: (state) => (id) => {
      return state.generations.find((gen) => gen.id === id);
    },
  },

  actions: {
    saveState() {
      const stateToSave = {
        generations: this.generations,
        ollamaConfig: this.ollamaConfig,
      };
      localStorage.setItem("llmStore", JSON.stringify(stateToSave));
    },

    setOllamaModel(model) {
      this.ollamaConfig.model = model;
      this.saveState();
    },

    async testOllamaConnection() {
      try {
        const response = await axios.get(`${this.ollamaConfig.baseUrl}/api/tags`);
        console.log("Modèles Ollama disponibles:", response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur de connexion à Ollama:", error);
        return false;
      }
    },

    async generateContent(data) {
      this.isLoading = true;
      this.error = null;
      console.log("Début de la génération de contenu avec Ollama:", data);

      try {
        // Vérifier la connexion à Ollama
        await axios.get(`${this.ollamaConfig.baseUrl}`);

        // Préparer le prompt pour Ollama
        const prompt = `
Tu es un assistant spécialisé dans la génération de contenu.

Voici des données extraites de ${data.url} :

TITRES:
${JSON.stringify(
  data.scrapedData.headings.map((h) => h.text),
  null,
  2
)}

PARAGRAPHES:
${JSON.stringify(data.scrapedData.paragraphs.slice(0, 10), null, 2)}

INSTRUCTION: ${data.prompt}

Génère une réponse structurée et formatée en HTML simple pour faciliter l'affichage.
        `;

        // Appel à l'API Ollama avec l'endpoint /api/generate
        console.log(`Tentative avec l'endpoint /api/generate et le modèle ${this.ollamaConfig.model}...`);
        const response = await axios.post(
          `${this.ollamaConfig.baseUrl}/api/generate`,
          {
            model: this.ollamaConfig.model,
            prompt: prompt,
            stream: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Réponse reçue de Ollama (/api/generate):", response.data);
        const generatedText = response.data.response;
        return this.processGeneratedText(data, generatedText);
      } catch (error) {
        console.error("Erreur détaillée lors de la génération avec Ollama:", error);

        if (error.response) {
          console.error("Erreur API - Statut:", error.response.status);
          console.error("Erreur API - Données:", error.response.data);
        }

        if (error.message && error.message.includes("Impossible de se connecter")) {
          this.error = error.message;
        } else if (error.response?.data?.error?.includes("not found")) {
          this.error = `Le modèle '${this.ollamaConfig.model}' n'a pas été trouvé. Assurez-vous qu'il est installé avec 'ollama pull ${this.ollamaConfig.model}'.`;
        } else if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
          this.error =
            "Impossible de se connecter à Ollama. Assurez-vous qu'Ollama est installé et en cours d'exécution sur votre machine.";
        } else {
          this.error =
            "Une erreur est survenue lors de la communication avec Ollama: " +
            (error.response?.data?.error || error.message);
        }
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    processGeneratedText(data, generatedText) {
      if (!generatedText) {
        throw new Error("Aucun texte n'a été généré par Ollama.");
      }
      const generationId = "gen_" + Date.now();
      const newGeneration = {
        id: generationId,
        timestamp: new Date().toISOString(),
        url: data.url,
        prompt: data.prompt,
        generatedContent: {
          title: `Contenu généré pour ${new URL(data.url).hostname}`,
          summary: generatedText.substring(0, 150) + "...",
          content: generatedText,
        },
      };
      this.generations.unshift(newGeneration);
      this.currentGeneration = newGeneration;
      this.saveState();
      return true;
    },

    setCurrentGeneration(generationId) {
      const generation = this.getGenerationById(generationId);
      if (generation) {
        this.currentGeneration = generation;
        return true;
      }
      return false;
    },

    deleteGeneration(generationId) {
      const index = this.generations.findIndex((gen) => gen.id === generationId);
      if (index !== -1) {
        this.generations.splice(index, 1);
        if (this.currentGeneration?.id === generationId) {
          this.currentGeneration = this.generations.length > 0 ? this.generations[0] : null;
        }
        this.saveState();
        return true;
      }
      return false;
    },
  },
});
