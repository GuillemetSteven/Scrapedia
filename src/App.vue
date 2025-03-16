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
/* Styles globaux */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #212529;
  line-height: 1.5;
}

/* Structure de l'application */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #343a40;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.app-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #f8f9fa;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 4px;
}

.nav-link:hover {
  color: #fff;
  background-color: #007bff;
}

.app-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.app-footer {
  background-color: #343a40;
  color: #f8f9fa;
  text-align: center;
  padding: 15px 0;
  margin-top: auto;
}

/* Styles communs utilisés dans plusieurs composants */
h1, h2, h3, h4, h5, h6 {
  color: #343a40;
  margin-bottom: 0.5em;
}

p {
  margin-bottom: 1em;
}

button {
  cursor: pointer;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-body {
  flex: 1 1 auto;
  padding: 1.25rem;
}

.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

/* Style pour indiquer la route active */
.nav-link.active {
  background-color: #007bff;
  color: white;
}

</style>
