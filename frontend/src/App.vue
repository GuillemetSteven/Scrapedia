<template>
  <div class="app">
    <header class="app-header">
      <nav class="app-nav">
        <a href="/" class="nav-link" @click.prevent="navigateTo('/')">Accueil</a>
        <a href="/scrap" class="nav-link" @click.prevent="navigateTo('/scrap')">Scraper</a>
        <a href="/generate" class="nav-link" @click.prevent="navigateTo('/generate')">Générer avec IA</a>
        <a href="/results" class="nav-link" @click.prevent="navigateTo('/results')">Résultats</a>
      </nav>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} - Vue.js Web Scraper & AI Generator - Projet éducatif</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap');

/* Reset and Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Noto Sans', 'Noto Sans JP', sans-serif;
  background-color: #f0f2f5;
  color: #1d3557;
  line-height: 1.6;
}

/* Structure de l'application */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header & Navigation */
.app-header {
  background-color: white;
  padding: 15px 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-nav {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.nav-link {
  text-decoration: none;
  color: #1d3557;
  font-weight: 500;
  padding: 12px 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: #2a9d8f;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #2a9d8f;
  background-color: rgba(42, 157, 143, 0.05);
}

.nav-link:hover::after {
  width: 70%;
}

.nav-link.active {
  color: #2a9d8f;
  background-color: rgba(42, 157, 143, 0.1);
}

.nav-link.active::after {
  width: 70%;
}

/* Content Area */
/* .app-content {
  flex: 1;
  padding: 40px 20px;
  background-color: #0867c5;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
} */

/* Footer */
.app-footer {
  background-color: white;
  color: #6c757d;
  text-align: center;
  padding: 20px 0;
  margin-top: auto;
  font-size: 0.9em;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.03);
}

/* Common Element Styles */
h1, h2, h3, h4, h5, h6 {
  color: #1d3557;
  margin-bottom: 0.8em;
  font-weight: 600;
  letter-spacing: -0.5px;
}

p {
  margin-bottom: 1.2em;
}

/* Button Styles */
.btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  color: white;
  background-color: #1d3557;
  border-color: #1d3557;
}

.btn-primary:hover {
  background-color: #152638;
  border-color: #152638;
}

.btn-success {
  color: white;
  background-color: #2a9d8f;
  border-color: #2a9d8f;
}

.btn-success:hover {
  background-color: #208b7f;
  border-color: #208b7f;
}

/* Card Styles */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: white;
  background-clip: border-box;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.card-body {
  flex: 1 1 auto;
  padding: 1.8rem;
}

/* Alert Styles */
.alert {
  position: relative;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.alert-success {
  color: #155724;
  background-color: #edf7f0;
  border-left: 4px solid #2a9d8f;
}

.alert-danger {
  color: #721c24;
  background-color: #fdf0f3;
  border-left: 4px solid #e63946;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .app-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    width: calc(50% - 10px);
    text-align: center;
  }
  
  .app-content {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .nav-link {
    width: 100%;
  }
}

/* Subtle Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.app-content > * {
  animation: fadeIn 0.5s ease forwards;
}

/* For focus accessibility */
button:focus, a:focus {
  outline: 2px solid #2a9d8f;
  outline-offset: 2px;
}

</style>
