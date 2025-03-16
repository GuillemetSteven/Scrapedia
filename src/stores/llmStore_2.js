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

// État initial, chargé depuis localStorage si disponible
const savedState = loadStateFromStorage();

export const useLlmStore = defineStore("llm", {
  // État initial
  state: () => ({
    // Liste des générations effectuées
    generations: savedState?.generations || [],
    // Génération actuelle
    currentGeneration: null,
    // Statuts
    isLoading: false,
    error: null,
    // Clé API (pour la démonstration, à gérer correctement dans une application réelle)
    // apiKey:
    //   "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",
  }),

  // Getters
  getters: {
    // Vérifier si nous avons des générations
    hasGenerations: (state) => state.generations.length > 0,

    // Récupérer une génération par son ID
    getGenerationById: (state) => (id) => {
      return state.generations.find((gen) => gen.id === id);
    },
  },

  // Actions
  actions: {
    // Sauvegarder l'état dans localStorage
    saveState() {
      const stateToSave = {
        generations: this.generations,
        apiKey: this.apiKey,
      };

      localStorage.setItem("llmStore", JSON.stringify(stateToSave));
    },

    // Définir la clé API
    setApiKey(key) {
      this.apiKey = key;
      this.saveState();
    },

    async generateContent(data) {
      this.isLoading = true;
      this.error = null;

      console.log("Début de la génération de contenu avec Ollama (DeepSeek-R1):", data);

      try {
        // Préparer le prompt pour DeepSeek-R1
        const prompt = `
          Voici des données extraites de ${data.url}. 
          Titres: ${JSON.stringify(data.scrapedData.headings.map((h) => h.text))}
          Paragraphes: ${JSON.stringify(data.scrapedData.paragraphs.slice(0, 10))}
          
          Utilise ces données pour: ${data.prompt}
        `;

        // Appel à l'API Ollama avec le modèle deepseek:r1
        const response = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "deepseek-r1",
            prompt: prompt,
            stream: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Réponse reçue de DeepSeek-R1:", response.data);

        // Extraire le texte généré
        const generatedText = response.data.response;

        // Créer la nouvelle génération
        const generationId = "gen_" + Date.now();
        const newGeneration = {
          id: generationId,
          timestamp: new Date().toISOString(),
          url: data.url,
          prompt: data.prompt,
          generatedContent: {
            title: `Contenu généré pour ${new URL(data.url).hostname} (DeepSeek-R1)`,
            summary: generatedText.substring(0, 150) + "...",
            content: generatedText,
          },
        };

        // Ajouter à la liste des générations
        this.generations.unshift(newGeneration);
        this.currentGeneration = newGeneration;
        this.saveState();

        return true;
      } catch (error) {
        console.error("Erreur détaillée lors de la génération avec DeepSeek-R1:", error);

        if (error.response) {
          console.error("Erreur API - Statut:", error.response.status);
          console.error("Erreur API - Données:", error.response.data);
        }

        this.error =
          "Une erreur est survenue lors de la communication avec Ollama: " +
          (error.response?.data?.error || error.message);

        // Si Ollama n'est pas accessible, suggérer de vérifier son installation
        if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
          this.error =
            "Impossible de se connecter à Ollama. Assurez-vous qu'Ollama est installé et en cours d'exécution sur votre machine.";
        }

        return false;
      } finally {
        this.isLoading = false;
      }
    },
    // Générer du contenu avec le LLM
    // Dans generateContent de llmStore.js
    // async generateContent(data) {
    //   this.isLoading = true;
    //   this.error = null;

    //   try {
    //     // Préparation des données pour l'API OpenAI
    //     const messages = [
    //       {
    //         role: "system",
    //         content: "Tu es un assistant qui va générer du contenu basé sur les données fournies.",
    //       },
    //       {
    //         role: "user",
    //         content: `Voici des données extraites de ${data.url}.
    //               Titres: ${JSON.stringify(data.scrapedData.headings.map((h) => h.text))}
    //               Paragraphes: ${JSON.stringify(data.scrapedData.paragraphs.slice(0, 10))}

    //               Utilise ces données pour: ${data.prompt}`,
    //       },
    //     ];

    //     // Appel à l'API OpenAI
    //     // Dans la méthode generateContent
    //     const response = await axios.post(
    //       "https://api.openai.com/v1/chat/completions",
    //       {
    //         model: "gpt-3.5-turbo",
    //         messages: messages,
    //         temperature: 0.7,
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${this.apiKey}`, // Assurez-vous que le format est exact
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     // Traitement de la réponse
    //     const generationId = "gen_" + Date.now();
    //     const generatedText = response.data.choices[0].message.content;

    //     const newGeneration = {
    //       id: generationId,
    //       timestamp: new Date().toISOString(),
    //       url: data.url,
    //       prompt: data.prompt,
    //       generatedContent: {
    //         title: `Contenu généré pour ${new URL(data.url).hostname}`,
    //         summary: generatedText.substring(0, 150) + "...",
    //         content: generatedText,
    //       },
    //     };

    //     // Ajouter à la liste des générations
    //     this.generations.unshift(newGeneration);
    //     this.currentGeneration = newGeneration;
    //     this.saveState();

    //     return true;
    //   } catch (error) {
    //     console.error("Erreur lors de la génération de contenu:", error);
    //     this.error =
    //       "Une erreur est survenue lors de la communication avec l'API OpenAI: " +
    //       (error.response?.data?.error?.message || error.message);
    //     return false;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    // Fonction pour simuler du contenu généré (à remplacer par l'API réelle)
    // simulateGeneratedContent(data) {
    //   // Extraire quelques textes des données scrapées pour la simulation
    //   const headings = data.scrapedData.headings.map((h) => h.text).slice(0, 3);
    //   const paragraphs = data.scrapedData.paragraphs.slice(0, 5);

    //   // Créer un contenu simulé basé sur le prompt
    //   let simulatedContent = "";

    //   if (data.prompt.toLowerCase().includes("résumé") || data.prompt.toLowerCase().includes("résume")) {
    //     simulatedContent += `<h2>Résumé du contenu de ${new URL(data.url).hostname}</h2>`;
    //     simulatedContent += "<p>Voici un résumé généré basé sur le contenu scrapé:</p>";

    //     // Ajouter quelques paragraphes modifiés
    //     simulatedContent +=
    //       "<p>Ce contenu a été résumé selon vos instructions. Dans une application réelle, le texte serait généré par l'API OpenAI.</p>";

    //     if (paragraphs.length > 0) {
    //       // Ajouter un paragraphe du contenu scrapé pour la démonstration
    //       const sampleParagraph = paragraphs[0];
    //       simulatedContent += `<p><strong>Extrait de l'article:</strong> ${sampleParagraph.substring(0, 200)}...</p>`;
    //     }
    //   } else if (data.prompt.toLowerCase().includes("point") || data.prompt.toLowerCase().includes("clé")) {
    //     simulatedContent += "<h2>Points clés du contenu</h2>";
    //     simulatedContent += "<ul>";

    //     // Ajouter quelques points basés sur les titres
    //     headings.forEach((heading) => {
    //       simulatedContent += `<li>${heading}</li>`;
    //     });

    //     // Ajouter quelques points supplémentaires
    //     simulatedContent += "<li>Point clé additionnel généré par l'IA (simulation)</li>";
    //     simulatedContent += "<li>Un autre point important identifié dans le texte</li>";
    //     simulatedContent += "</ul>";
    //   } else {
    //     simulatedContent += "<h2>Contenu généré</h2>";
    //     simulatedContent += `<p>Contenu généré selon l'instruction: "${data.prompt}"</p>`;
    //     simulatedContent +=
    //       "<p>Dans une application réelle, ce contenu serait généré par l'API OpenAI en utilisant les données scrapées.</p>";

    //     // Ajouter quelques paragraphes du contenu scrapé
    //     if (paragraphs.length > 0) {
    //       simulatedContent += "<h3>Extraits pertinents</h3>";
    //       simulatedContent += `<p>${paragraphs[0]}</p>`;

    //       if (paragraphs.length > 1) {
    //         simulatedContent += `<p>${paragraphs[1]}</p>`;
    //       }
    //     }
    //   }

    //   return simulatedContent;
    // },

    // Définir une génération comme actuelle
    setCurrentGeneration(generationId) {
      const generation = this.getGenerationById(generationId);
      if (generation) {
        this.currentGeneration = generation;
        return true;
      }
      return false;
    },

    // Supprimer une génération
    deleteGeneration(generationId) {
      const index = this.generations.findIndex((gen) => gen.id === generationId);
      if (index !== -1) {
        this.generations.splice(index, 1);

        // Si c'était la génération actuelle, la réinitialiser
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
