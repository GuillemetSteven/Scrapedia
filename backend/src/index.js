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
    const url = req.query.url || "https://fr.wikipedia.org/wiki/Hunter_%C3%97_Hunter";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const data = await page.evaluate(() => {
      const cleanText = (text) => {
        return text
          .replace(/\[\d+\]/g, "")
          .replace(/\s+/g, " ")
          .trim();
      };

      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4")) // prendre les titres que je veux
        .filter((h) => !h.querySelector(".mw-editsection"))
        .filter((h) => !/sommaire/i.test(h.textContent))
        .map((h) => ({
          level: h.tagName,
          text: cleanText(h.textContent),
          // class: h.className,
        }));

      const paragraphs = Array.from(document.querySelectorAll("p"))
        .filter((p) => {
          // Exclure l'info box sur les pages wikis
          const isInInfobox = p.closest(".infobox_v3") !== null;
          return !isInInfobox && p.textContent.trim().length > 0; //
        })
        .map((p) => cleanText(p.textContent));

      return { headings, paragraphs };
    });

    await browser.close();

    res.json(data); // Envoyer les paragraphes au frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
