<template>
  <article class="podcast-card" @click="goToPodcast">
    <div class="card-image">
      <img v-if="imageUrl" :src="imageUrl" :alt="podcast.title" />
      <div v-else class="card-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </div>
      <div class="card-overlay">
        <button class="play-btn" @click.stop="$emit('play', podcast)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ podcast.title }}</h3>
      <p class="card-date">{{ displayDate }}</p>
      <p class="card-description">{{ truncatedDescription }}</p>
      <router-link :to="`/podcast/${podcast.id}`" class="card-link" @click.stop>
        Jetzt anhören
      </router-link>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { podcastStore } from '../stores/podcasts'

const props = defineProps({
  podcast: {
    type: Object,
    required: true
  }
})

defineEmits(['play'])

const router = useRouter()

const imageUrl = computed(() => podcastStore.getImageUrl(props.podcast))

const displayDate = computed(() => {
  return props.podcast.date || podcastStore.formatDate(props.podcast.createdAt)
})

const truncatedDescription = computed(() => {
  const desc = props.podcast.description || ''
  if (desc.length > 100) {
    return desc.substring(0, 100) + '...'
  }
  return desc
})

function goToPodcast() {
  router.push(`/podcast/${props.podcast.id}`)
}
</script>

<style scoped>
.podcast-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.podcast-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.podcast-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 90, 138, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.podcast-card:hover .card-overlay {
  opacity: 1;
}

.play-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a5a8a;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.1);
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a5a8a;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.card-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.card-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-link {
  color: #e67e22;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.card-link:hover {
  color: #d35400;
  text-decoration: underline;
}
</style>
