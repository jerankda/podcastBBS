<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Podcaster</h1>
        <p class="hero-subtitle">Deine Podcast Plattform</p>
        <p class="hero-tagline">Entdecke deinen nächsten Lieblingspodcast</p>
      </div>
      <div class="hero-cta">
        <router-link to="/browse" class="btn btn-primary">Podcasts durchsuchen</router-link>
        <router-link to="/register" class="btn btn-secondary">Jetzt anhören</router-link>
      </div>
    </section>

    <!-- Featured Podcasts -->
    <section class="section">
      <div class="container">
        <div class="section-content">
          <div class="podcasts-grid">
            <PodcastCard 
              v-for="podcast in featuredPodcasts" 
              :key="podcast.id"
              :podcast="podcast"
              @play="playPodcast"
            />
          </div>
          
          <aside class="sidebar">
            <div class="sidebar-box">
              <router-link to="/register" class="btn btn-primary btn-block">
                Konto erstellen
              </router-link>
              <p class="sidebar-note">Kostenlos registrieren</p>
            </div>
            
            <div class="sidebar-box">
              <router-link to="/upload" class="btn btn-secondary btn-block">
                Podcast hochladen
              </router-link>
            </div>
            
            <div class="sidebar-section">
              <h3>Beliebte Kategorien</h3>
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-icon">🎵</span>
                  <div>
                    <strong>Technologie</strong>
                    <p>Tech-News & Reviews</p>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">💼</span>
                  <div>
                    <strong>Business</strong>
                    <p>Unternehmertum Tipps</p>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">🎨</span>
                  <div>
                    <strong>Design</strong>
                    <p>Kreative Inspiration</p>
                  </div>
                </div>
              </div>
            </div>
            
            <router-link to="/browse" class="btn btn-outline btn-block">
              Alle Kategorien
            </router-link>
            
            <div class="sidebar-section">
              <h3>Unsere Features</h3>
              <div class="projects-grid">
                <div class="project-item">
                  <div class="project-icon">🎧</div>
                  <span>Überall hören</span>
                </div>
                <div class="project-item">
                  <div class="project-icon">📤</div>
                  <span>Einfacher Upload</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- More Podcasts -->
    <section class="section section-alt">
      <div class="container">
        <h2 class="section-title">Weitere Episoden</h2>
        <div class="podcasts-row">
          <PodcastCard 
            v-for="podcast in morePodcasts" 
            :key="podcast.id"
            :podcast="podcast"
            @play="playPodcast"
          />
        </div>
      </div>
    </section>

    <!-- Audio Player -->
    <AudioPlayer 
      v-if="currentPodcast" 
      :podcast="currentPodcast"
      @close="currentPodcast = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { podcastStore } from '../stores/podcasts'
import PodcastCard from '../components/PodcastCard.vue'
import AudioPlayer from '../components/AudioPlayer.vue'

const currentPodcast = ref(null)

const featuredPodcasts = computed(() => podcastStore.podcasts.slice(0, 3))
const morePodcasts = computed(() => podcastStore.podcasts.slice(3, 6))

function playPodcast(podcast) {
  currentPodcast.value = podcast
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  color: white;
  padding: 4rem 1.5rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  opacity: 0.5;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-tagline {
  font-size: 1.5rem;
  font-style: italic;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.hero-cta {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.section {
  padding: 3rem 1.5rem;
}

.section-alt {
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  color: #1a5a8a;
  margin-bottom: 2rem;
  font-weight: 600;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.podcasts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.podcasts-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-box {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.sidebar-note {
  color: #e67e22;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.sidebar-section {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-section h3 {
  font-size: 1.1rem;
  color: #1a5a8a;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1a5a8a;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.contact-icon {
  font-size: 1.25rem;
}

.contact-item strong {
  display: block;
  color: #333;
}

.contact-item p {
  color: #666;
  font-size: 0.8rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.project-item {
  text-align: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.project-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.project-item span {
  font-size: 0.75rem;
  color: #666;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 1rem;
  text-align: center;
}

.btn-primary {
  background: #1a5a8a;
  color: white;
}

.btn-primary:hover {
  background: #14486e;
}

.btn-secondary {
  background: #e67e22;
  color: white;
}

.btn-secondary:hover {
  background: #d35400;
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

.btn-block {
  display: block;
  width: 100%;
}

@media (max-width: 992px) {
  .section-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .podcasts-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-cta {
    flex-direction: column;
  }
  
  .sidebar {
    grid-template-columns: 1fr;
  }
  
  .podcasts-grid,
  .podcasts-row {
    grid-template-columns: 1fr;
  }
}
</style>
