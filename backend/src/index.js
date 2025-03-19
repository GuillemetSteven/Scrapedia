// https://www.youtube.com/watch?v=ssRo5nVOvrQ
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());

// Route de test pour vérifier que le backend fonctionne
app.get("/test", (req, res) => {
  res.json({ message: "Le backend fonctionne ! 🚀" });
});

app.get("/scrap", async (req, res) => {
  try {
    const url = req.query.url;

    // Validation basique de l'URL
    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "URL invalide. Elle doit commencer par http:// ou https://" });
    }

    // Vérification si c'est une URL Wikipedia
    const isWikipedia = url.includes("wikipedia.org");
    if (!isWikipedia) {
      return res
        .status(400)
        .json({ error: "Cette application est optimisée pour scraper des pages Wikipedia uniquement." });
    }

    // Récupérer les options de scraping (par défaut, on récupère tout)
    const scrapHeadings = req.query.headings !== "false"; // True par défaut
    const scrapParagraphs = req.query.paragraphs !== "false"; // True par défaut

    // Lancer le navigateur avec un timeout
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Configurer un timeout pour la navigation
    let navigationTimeout = 30000; // 30 secondes
    await page.setDefaultNavigationTimeout(navigationTimeout);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
    } catch (navigationError) {
      await browser.close();
      return res.status(504).json({
        error: "Impossible de charger la page dans le délai imparti. Veuillez vérifier l'URL ou réessayer plus tard.",
      });
    }

    // Vérifier si la page contient du contenu Wikipedia attendu
    const isValidWikiPage = await page.evaluate(() => {
      return !!document.querySelector("#content") || !!document.querySelector(".mw-parser-output");
    });

    if (!isValidWikiPage) {
      await browser.close();
      return res.status(400).json({
        error: "La page ne semble pas être une page Wikipedia valide ou est vide.",
      });
    }

    const data = await page.evaluate(
      (scrapH, scrapP) => {
        const cleanText = (text) => {
          return text
            .replace(/\[\d+\]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        };

        // Objet pour stocker les résultats
        const result = {};

        // Récupérer les titres si demandé
        if (scrapH) {
          result.headings = Array.from(document.querySelectorAll("h1, h2, h3, h4"))
            .filter((h) => !h.querySelector(".mw-editsection"))
            .filter((h) => !/sommaire/i.test(h.textContent))
            .map((h) => ({
              level: h.tagName,
              text: cleanText(h.textContent),
            }));
        } else {
          result.headings = [];
        }

        // Récupérer les paragraphes si demandé
        if (scrapP) {
          result.paragraphs = Array.from(document.querySelectorAll("p"))
            .filter((p) => {
              // Exclure l'info box sur les pages wikis
              const isInInfobox = p.closest(".infobox_v3") !== null;
              return !isInInfobox && p.textContent.trim().length > 0;
            })
            .map((p) => cleanText(p.textContent));
        } else {
          result.paragraphs = [];
        }

        return result;
      },
      scrapHeadings,
      scrapParagraphs
    );

    await browser.close();

    // Vérifier si des données ont été récupérées
    if (scrapHeadings && data.headings.length === 0 && scrapParagraphs && data.paragraphs.length === 0) {
      return res.status(404).json({
        error: "Aucune donnée n'a pu être extraite de cette page. Vérifiez que l'URL est correcte.",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur s'est produite lors du scraping: " + error.message,
      details: error.stack,
    });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
