<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <div class="logo-placeholder">
          <span class="logo-icon">🎙️</span>
          <div class="logo-text">
            <span class="logo-title">Podcaster</span>
            <span class="logo-subtitle">Deine Podcast Plattform</span>
          </div>
        </div>
      </router-link>
      
      <nav class="nav">
        <router-link to="/browse" class="nav-link">Durchsuchen</router-link>
        <router-link to="/" class="nav-link">Kategorien</router-link>
        <router-link to="/upload" class="nav-link" v-if="isAuthenticated">Hochladen</router-link>
        <button class="nav-search" @click="toggleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </nav>
      
      <div class="header-actions">
        <template v-if="isAuthenticated">
          <router-link to="/account" class="btn btn-outline">Konto</router-link>
          <button @click="logout" class="btn btn-primary">Abmelden</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-outline">Anmelden</router-link>
          <router-link to="/register" class="btn btn-primary">Registrieren</router-link>
        </template>
      </div>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <!-- Search Bar -->
    <div class="search-bar" :class="{ active: showSearch }">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Podcasts suchen..."
        @keyup.enter="performSearch"
      />
      <button @click="performSearch">Suchen</button>
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ active: showMobileMenu }">
      <router-link to="/browse" class="mobile-nav-link" @click="closeMobileMenu">Durchsuchen</router-link>
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Kategorien</router-link>
      <router-link to="/upload" class="mobile-nav-link" v-if="isAuthenticated" @click="closeMobileMenu">Hochladen</router-link>
      <template v-if="isAuthenticated">
        <router-link to="/account" class="mobile-nav-link" @click="closeMobileMenu">Konto</router-link>
        <button @click="logout" class="mobile-nav-link">Abmelden</button>
      </template>
      <template v-else>
        <router-link to="/login" class="mobile-nav-link" @click="closeMobileMenu">Anmelden</router-link>
        <router-link to="/register" class="mobile-nav-link" @click="closeMobileMenu">Registrieren</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()
const showSearch = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated())

function toggleSearch() {
  showSearch.value = !showSearch.value
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/browse', query: { q: searchQuery.value } })
    showSearch.value = false
  }
}

async function logout() {
  await authStore.logout()
  router.push('/')
  closeMobileMenu()
}
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a5a8a;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #666;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #1a5a8a;
}

.nav-search {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.nav-search:hover {
  color: #1a5a8a;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: #1a5a8a;
  color: white;
}

.btn-primary:hover {
  background: #14486e;
}

.btn-outline {
  background: transparent;
  color: #1a5a8a;
  border: 1px solid #1a5a8a;
}

.btn-outline:hover {
  background: #1a5a8a;
  color: white;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  display: block;
  width: 25px;
  height: 2px;
  background: #333;
  transition: all 0.2s;
}

.search-bar {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #f5f5f5;
}

.search-bar.active {
  max-height: 80px;
}

.search-bar input {
  width: calc(100% - 120px);
  max-width: 600px;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  margin: 1rem;
  margin-right: 0;
}

.search-bar button {
  padding: 0.75rem 1.5rem;
  background: #1a5a8a;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .nav,
  .header-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: flex;
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: white;
    border-top: 1px solid #eee;
  }
  
  .mobile-menu.active {
    max-height: 400px;
  }
  
  .mobile-nav-link {
    padding: 1rem 1.5rem;
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #eee;
    background: none;
    border-left: none;
    border-right: none;
    text-align: left;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .mobile-nav-link:hover {
    background: #f5f5f5;
    color: #1a5a8a;
  }
}
</style>
