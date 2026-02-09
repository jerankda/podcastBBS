<template>
  <div class="podcast-page" v-if="podcast">
    <div class="container">
      <div class="podcast-content">
        <main class="podcast-main">
          <!-- Podcast Header -->
          <div class="podcast-header">
            <div class="podcast-cover">
              <img v-if="imageUrl" :src="imageUrl" :alt="podcast.title" />
              <div v-else class="podcast-cover-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
            </div>
            <div class="podcast-info">
              <span class="podcast-category">{{ podcast.category }}</span>
              <h1>{{ podcast.title }}</h1>
              <p class="podcast-author">by {{ podcast.author }}</p>
              <div class="podcast-meta">
                <span>{{ displayDate }}</span>
                <span>•</span>
                <span>{{ podcast.duration }}</span>
              </div>
            </div>
          </div>
          
          <!-- Player -->
          <div class="inline-player">
            <audio 
              ref="audioRef" 
              :src="audioUrl"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              @ended="onEnded"
            ></audio>
            
            <div class="player-controls">
              <button class="control-btn" @click="skipBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="11 19 2 12 11 5 11 19"></polygon>
                  <polygon points="22 19 13 12 22 5 22 19"></polygon>
                </svg>
              </button>
              
              <button class="play-pause-btn" @click="togglePlay">
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
              
              <button class="control-btn" @click="skipForward">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 19 22 12 13 5 13 19"></polygon>
                  <polygon points="2 19 11 12 2 5 2 19"></polygon>
                </svg>
              </button>
            </div>
            
            <div class="player-progress">
              <span class="time">{{ formatTime(currentTime) }}</span>
              <input 
                type="range" 
                class="progress-bar"
                :value="currentTime"
                :max="duration"
                @input="seek"
              />
              <span class="time">{{ formatTime(duration) }}</span>
            </div>
            
            <div class="player-extras">
              <div class="volume-control">
                <button class="volume-btn" @click="toggleMute">
                  <svg v-if="volume > 0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                </button>
                <input 
                  type="range" 
                  class="volume-slider"
                  v-model="volume"
                  min="0"
                  max="1"
                  step="0.1"
                  @input="updateVolume"
                />
              </div>
              
              <div class="speed-control">
                <select v-model="playbackRate" @change="updatePlaybackRate">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Beschreibung -->
          <div class="podcast-description">
            <h2>Über diese Episode</h2>
            <p>{{ podcast.description }}</p>
          </div>
        </main>
        
        <!-- Sidebar -->
        <aside class="podcast-sidebar">
          <div class="sidebar-box">
            <h3>Weitere Episoden</h3>
            <div class="related-list">
              <router-link 
                v-for="related in relatedPodcasts" 
                :key="related.id"
                :to="`/podcast/${related.id}`"
                class="related-item"
              >
                <div class="related-image">
                  <img v-if="related.imageUrl || related.image" :src="podcastStore.getImageUrl(related)" :alt="related.title" />
                  <div v-else class="related-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                </div>
                <div class="related-info">
                  <span class="related-title">{{ related.title }}</span>
                  <span class="related-meta">{{ related.duration }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found">
    <h1>Podcast nicht gefunden</h1>
    <router-link to="/" class="btn btn-primary">Zur Startseite</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { podcastStore } from '../stores/podcasts'

const route = useRoute()
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const previousVolume = ref(1)
const playbackRate = ref('1')
const podcast = ref(null)
const loading = ref(true)

// Load podcast
async function loadPodcast() {
  loading.value = true
  podcast.value = await podcastStore.getPodcast(route.params.id)
  loading.value = false
}

onMounted(() => {
  loadPodcast()
})

watch(() => route.params.id, () => {
  loadPodcast()
})

const imageUrl = computed(() => podcastStore.getImageUrl(podcast.value))
const audioUrl = computed(() => podcastStore.getAudioUrl(podcast.value))
const displayDate = computed(() => {
  if (!podcast.value) return ''
  return podcast.value.date || podcastStore.formatDate(podcast.value.createdAt)
})

const relatedPodcasts = computed(() => {
  return podcastStore.podcasts
    .filter(p => p.id !== route.params.id && p.id !== parseInt(route.params.id))
    .slice(0, 4)
})

function togglePlay() {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

function skipBack() {
  if (audioRef.value) {
    audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - 15)
  }
}

function skipForward() {
  if (audioRef.value) {
    audioRef.value.currentTime = Math.min(duration.value, audioRef.value.currentTime + 15)
  }
}

function seek(event) {
  if (audioRef.value) {
    audioRef.value.currentTime = event.target.value
  }
}

function updateVolume() {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
}

function toggleMute() {
  if (volume.value > 0) {
    previousVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = previousVolume.value
  }
  updateVolume()
}

function updatePlaybackRate() {
  if (audioRef.value) {
    audioRef.value.playbackRate = parseFloat(playbackRate.value)
  }
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('Link copied to clipboard!')
}

// Reset player when navigating between podcasts
watch(() => route.params.id, () => {
  isPlaying.value = false
  currentTime.value = 0
})
</script>

<style scoped>
.podcast-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.podcast-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.podcast-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.podcast-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 2rem;
}

.podcast-cover {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  flex-shrink: 0;
}

.podcast-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.podcast-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.podcast-info {
  flex: 1;
}

.podcast-category {
  display: inline-block;
  background: #e8f4fc;
  color: #1a5a8a;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.podcast-info h1 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.podcast-author {
  color: #1a5a8a;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.podcast-meta {
  display: flex;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.inline-player {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  transition: color 0.2s;
}

.control-btn:hover {
  color: #1a5a8a;
}

.play-pause-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1a5a8a;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.2s, transform 0.2s;
}

.play-pause-btn:hover {
  background: #14486e;
  transform: scale(1.05);
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.time {
  font-size: 0.85rem;
  color: #666;
  min-width: 45px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1a5a8a;
  cursor: pointer;
}

.player-extras {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
}

.volume-slider {
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #1a5a8a;
  cursor: pointer;
}

.speed-control select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.podcast-description {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.podcast-description h2 {
  font-size: 1.25rem;
  color: #1a5a8a;
  margin-bottom: 1rem;
}

.podcast-description p {
  color: #555;
  line-height: 1.7;
}

.podcast-share {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.podcast-share h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.share-buttons {
  display: flex;
  gap: 0.75rem;
}

.share-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #1a5a8a;
  border-color: #1a5a8a;
  color: white;
}

.podcast-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-box h3 {
  font-size: 1.1rem;
  color: #1a5a8a;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1a5a8a;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-item {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.related-item:hover {
  background: #f8f9fa;
}

.related-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  flex-shrink: 0;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.related-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.related-meta {
  font-size: 0.8rem;
  color: #666;
}

.subscribe-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subscribe-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s;
}

.subscribe-btn:hover {
  background: #f8f9fa;
  border-color: #1a5a8a;
}

.subscribe-btn span {
  font-size: 1.25rem;
}

.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.not-found h1 {
  color: #333;
}

.btn {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: #1a5a8a;
  color: white;
}

.btn-primary:hover {
  background: #14486e;
}

@media (max-width: 992px) {
  .podcast-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .podcast-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .podcast-cover {
    width: 150px;
    height: 150px;
  }
  
  .podcast-meta {
    justify-content: center;
  }
}
</style>
