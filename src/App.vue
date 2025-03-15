<script setup>
// App.vue
</script>

<template>
  <div class="app">
    <header class="app-header">
      <nav class="app-nav">
        <router-link to="/" class="nav-link">Accueil</router-link>
        <router-link to="/scrap" class="nav-link">Scraper</router-link>
      </nav>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} - WikiHarvest - Projet éducatif</p>
    </footer>
  </div>
</template>

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
  padding: 5px 0;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

.router-link-active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
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
</style>