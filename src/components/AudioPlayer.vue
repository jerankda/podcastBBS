<template>
  <div class="audio-player" v-if="podcast">
    <div class="player-container">
      <div class="player-info">
        <div class="player-image">
          <img v-if="podcast.image" :src="podcast.image" :alt="podcast.title" />
          <div v-else class="player-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
        </div>
        <div class="player-details">
          <h4 class="player-title">{{ podcast.title }}</h4>
          <p class="player-author">{{ podcast.author }}</p>
        </div>
      </div>
      
      <div class="player-controls">
        <button class="control-btn" @click="skipBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="11 19 2 12 11 5 11 19"></polygon>
            <polygon points="22 19 13 12 22 5 22 19"></polygon>
          </svg>
        </button>
        
        <button class="play-pause-btn" @click="togglePlay">
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
        
        <button class="control-btn" @click="skipForward">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
      
      <div class="player-volume">
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
      
      <button class="close-btn" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <audio 
      ref="audioRef"
      :src="podcast.audioUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  podcast: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const previousVolume = ref(1)

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
    audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - 10)
  }
}

function skipForward() {
  if (audioRef.value) {
    audioRef.value.currentTime = Math.min(duration.value, audioRef.value.currentTime + 10)
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

watch(() => props.podcast, (newPodcast) => {
  if (newPodcast && audioRef.value) {
    isPlaying.value = false
    currentTime.value = 0
    setTimeout(() => {
      audioRef.value.play()
      isPlaying.value = true
    }, 100)
  }
})
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.player-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}

.player-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  flex-shrink: 0;
}

.player-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
}

.player-details {
  overflow: hidden;
}

.player-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-author {
  font-size: 0.8rem;
  color: #666;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.control-btn:hover {
  color: #1a5a8a;
}

.play-pause-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #1a5a8a;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.2s;
}

.play-pause-btn:hover {
  background: #14486e;
}

.player-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time {
  font-size: 0.8rem;
  color: #666;
  min-width: 40px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 2px;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #1a5a8a;
  cursor: pointer;
}

.player-volume {
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
  display: flex;
  align-items: center;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1a5a8a;
  cursor: pointer;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

@media (max-width: 768px) {
  .player-container {
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
  }
  
  .player-info {
    order: 1;
    min-width: auto;
    flex: 1;
  }
  
  .player-controls {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .player-progress {
    order: 4;
    width: 100%;
  }
  
  .player-volume {
    display: none;
  }
  
  .close-btn {
    order: 2;
  }
}
</style>
