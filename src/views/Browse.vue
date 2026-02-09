<template>
  <div class="browse-page">
    <div class="container">
      <!-- Search & Filter Header -->
      <div class="browse-header">
        <h1>Podcasts durchsuchen</h1>
        
        <div class="search-filter">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Podcasts suchen..."
              @input="handleSearch"
            />
          </div>
          
          <select v-model="selectedCategory" @change="filterByCategory">
            <option value="">Alle Kategorien</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          
          <select v-model="sortBy" @change="sortPodcasts">
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="title">Titel A-Z</option>
          </select>
        </div>
      </div>
      
      <!-- Categories Bar -->
      <div class="categories-bar">
        <button 
          v-for="cat in ['Alle', ...categories]" 
          :key="cat"
          :class="['category-btn', { active: selectedCategory === (cat === 'Alle' ? '' : cat) }]"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
      
      <!-- Results Info -->
      <div class="results-info">
        <span>{{ filteredPodcasts.length }} Podcasts gefunden</span>
        <button v-if="searchQuery || selectedCategory" class="clear-btn" @click="clearFilters">
          Filter zurücksetzen
        </button>
      </div>
      
      <!-- Podcasts Grid -->
      <div class="podcasts-grid">
        <PodcastCard 
          v-for="podcast in filteredPodcasts" 
          :key="podcast.id"
          :podcast="podcast"
          @play="playPodcast"
        />
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredPodcasts.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>Keine Podcasts gefunden</h3>
        <p>Versuche, deine Such- oder Filterkriterien anzupassen</p>
        <button class="btn btn-primary" @click="clearFilters">Filter zurücksetzen</button>
      </div>
      
      <!-- Load More -->
      <div v-if="filteredPodcasts.length >= 6" class="load-more">
        <button class="btn btn-outline">Mehr laden</button>
      </div>
    </div>
    
    <!-- Audio Player -->
    <AudioPlayer 
      v-if="currentPodcast" 
      :podcast="currentPodcast"
      @close="currentPodcast = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { podcastStore } from '../stores/podcasts'
import PodcastCard from '../components/PodcastCard.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const route = useRoute()
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPodcast = ref(null)

const categories = ['Technology', 'Business', 'Science', 'Design', 'Lifestyle', 'Entertainment', 'Education']

const filteredPodcasts = computed(() => {
  let result = [...podcastStore.podcasts]
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  
  // Sort
  if (sortBy.value === 'newest') {
    // Already in order
  } else if (sortBy.value === 'oldest') {
    result = result.reverse()
  } else if (sortBy.value === 'title') {
    result = result.sort((a, b) => a.title.localeCompare(b.title))
  }
  
  return result
})

function handleSearch() {
  // Debounce could be added here
}

function filterByCategory() {
  // Already reactive
}

function sortPodcasts() {
  // Already reactive
}

function selectCategory(cat) {
  selectedCategory.value = cat === 'Alle' ? '' : cat
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'newest'
}

function playPodcast(podcast) {
  currentPodcast.value = podcast
}

onMounted(() => {
  // Check for search query from URL
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
})
</script>

<style scoped>
.browse-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.browse-header {
  margin-bottom: 1.5rem;
}

.browse-header h1 {
  font-size: 2rem;
  color: #1a5a8a;
  margin-bottom: 1.5rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.search-box svg {
  color: #999;
}

.search-box input {
  flex: 1;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-filter select {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  cursor: pointer;
  min-width: 150px;
}

.categories-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #1a5a8a;
  color: #1a5a8a;
}

.category-btn.active {
  background: #1a5a8a;
  border-color: #1a5a8a;
  color: white;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #666;
}

.clear-btn {
  background: none;
  border: none;
  color: #1a5a8a;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.clear-btn:hover {
  color: #14486e;
}

.podcasts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 1rem;
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
  border: 2px solid #1a5a8a;
}

.btn-outline:hover {
  background: #1a5a8a;
  color: white;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .search-filter select {
    width: 100%;
  }
  
  .categories-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .category-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .podcasts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
