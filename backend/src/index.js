// import puppeteer from 'puppeteer';

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
    if (!url.startsWith("http")) {
      return res.status(400).json({ error: "URL invalide. Elle doit commencer par http:// ou https://" });
    }

    // Récupérer les options de scraping (par défaut, on récupère tout)
    const scrapHeadings = req.query.headings !== "false"; // True par défaut
    const scrapParagraphs = req.query.paragraphs !== "false"; // True par défaut

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

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

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
