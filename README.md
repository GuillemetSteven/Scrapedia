# Web Scraper & Générateur IA

Ce projet est une application web développée avec Vue.js permettant d'extraire des données de Wikipedia et de générer du nouveau contenu à partir de ces informations via un serveur Ollama local.
Pour dire vrai, Ce projet a été essentiellement développé avec l'aide de Claude Sonnet. Toutefois, l’objectif est de reproduire progressivement toutes les fonctionnalités essentielles à partir de cette base technique, que j’ai déjà explorée pendant de nombreuses heures, tout en ajoutant de nouvelles fonctionnalités et améliorations à l’avenir.

## Objectif du projet

L'objectif principal de ce projet est de créer une application web qui:

1. Extrait (scrape) des données depuis des pages Wikipédia
2. Utiliser ces données comme base pour générer de nouveaux contenus via un modèle d'IA local
3. Offre une expérience utilisateur fluide et intuitive
4. Permet de conserver un historique des extractions et générations

## Fonctionnalités principales

### Extraction de données (Scraping)

- Extraction ciblée des titres et paragraphes de pages Wikipedia
- Affichage visuel des données extraites
- Historique des extractions précédentes
- Interface de détail pour visualiser la structuration des données extraites

### Génération de contenu avec IA

- Utilisation du modèle Phi (ou autres modèles) via Ollama pour générer du contenu
- Prompts personnalisables avec suggestions
- Sauvegarde automatique des générations
- Affichage formaté des résultats générés

### Interface utilisateur

- Design responsive
- Navigation intuitive entre les différentes fonctionnalités
- Aperçus visuels des données extraites et générées
- Gestion complète des états de chargement et des erreurs

## Stack technique

- **Frontend**: Vue.js 3 avec Composition API
- **État**: Pinia pour la gestion d'état
- **Routing**: Vue Router
- **HTTP**: Axios pour les requêtes API
- **IA**: Intégration avec Ollama (modèle Phi)
- **Persistence**: LocalStorage pour sauvegarder les données localement

## Installation et démarrage

### Prérequis

- Node.js (v14+)
- npm ou yarn
- Ollama installé localement (pour la génération IA)

### Installation d'Ollama

#### Windows

1. Téléchargez et installez Ollama depuis [https://ollama.com/download/windows](https://ollama.com/download/windows)
2. Ouvrez une invite de commande et exécutez: `ollama pull phi` ou modèle de votre choix
3. Vérifiez que Ollama est en cours d'exécution (icône dans la zone de notification)

#### macOS

1. Téléchargez et installez Ollama depuis [https://ollama.com/download/mac](https://ollama.com/download/mac)
2. Ouvrez un Terminal et exécutez: `ollama pull phi` ou modèle de votre choix
3. Vérifiez que Ollama est en cours d'exécution (icône dans la barre de menu)

### Installation du serveur backend pour le scraping

1. Naviguez vers le dossier `backend` du projet

```bash
cd backend
```

2. Installez les dépendances

```bash
npm install express puppeteer cors
```

3. Naviguez vers le dossier `backend\src` du projet

```bash
cd backend\src\
```

4. Démarrez le serveur

```bash
 node .\index.js
```

Le serveur sera disponible sur `http://localhost:3000`

### Installation du frontend

1. Dans un autre terminal, naviguez vers la racine du projet

```bash
cd ..\frontend\
```

2. Installez les dépendances

```bash
npm install
```

3. Démarrez l'application

```bash
npm run dev
```

4. Ouvrez l'application dans votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`)

## Difficultés rencontrées et solutions

### 1. Intégration avec Ollama

**Problème**: L'intégration avec Ollama a présenté des défis en termes de gestion des erreurs et de configuration. J'ai du essayer plusieurs modèles et vérifier comment ça fonctionne.

**Solution**: Mise en place d'un système robuste de détection des erreurs spécifiques (modèle non trouvé, serveur non démarré) et affichage de messages d'erreur pertinents pour aider l'utilisateur.

### 2. Structuration des données scrapées

**Problème**: La mise en relation des titres et paragraphes extraits de Wikipedia était difficile.

**Solution**: Création d'un algorithme qui associe intelligemment les paragraphes aux titres correspondants dans le composant ScrapDetail.vue, pour créer une structure hiérarchique cohérente.  
Plusieurs vidéos ont été regardés dont :
https://www.youtube.com/watch?v=CosPILI0qrw & https://www.youtube.com/watch?v=ssRo5nVOvrQ

### 3. Persistence des données

**Problème**: Garder l'historique des données scrapées et des générations entre les sessions.

**Solution**: Utilisation de localStorage avec une structure claire pour sauvegarder les états Pinia, avec une logique de chargement au démarrage de l'application. Pour ce projet j'ai pensé qu'implémenter firebase serait trop ambitieux, alors j'ai opté pour utilisé localstorage

### 4. Gestion des requêtes asynchrones

**Problème**: Gestion des états de chargement et des erreurs lors des opérations asynchrones.

**Solution**: Mise en place d'un système cohérent avec des états isLoading et error dans les stores, ainsi que des timeouts de sécurité pour détecter les requêtes trop longues.

## Améliorations futures

- Ajouter la possibilité de scraper d'autres sites que Wikipedia
- Possibilité d'avoir plusieurs pages wikipedia avant de tout scraper
- Implémenter un système de tags pour organiser les générations
- Ajouter des options d'export (PDF, Markdown, etc.)
- Améliorer les suggestions de prompts avec un système d'apprentissage basé sur les prompts utilisés
- Ajouter un mode hors-ligne avec synchronisation ultérieure

---

Ce projet a été développé par [OUI] pour le cours Framework Web 2.
