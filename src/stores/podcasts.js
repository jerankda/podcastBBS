import { reactive } from 'vue'
import { api } from '../services/api'

// Sample podcasts for when API is not available
const samplePodcasts = [
  {
    id: 'sample-1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly episode.',
    author: 'Tech Talk',
    authorId: 'sample-user-1',
    createdAt: '2026-02-06',
    duration: '45:30',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'Technology'
  },
  {
    id: 'sample-2',
    title: 'The Future of AI',
    description: 'Exploring how artificial intelligence is shaping our world and what to expect next.',
    author: 'Future Forward',
    authorId: 'sample-user-2',
    createdAt: '2026-01-29',
    duration: '52:15',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Technology'
  },
  {
    id: 'sample-3',
    title: 'Mindfulness and Productivity',
    description: 'Discover techniques to stay focused and productive while maintaining mental wellness.',
    author: 'Wellness Weekly',
    authorId: 'sample-user-3',
    createdAt: '2026-01-21',
    duration: '38:45',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Lifestyle'
  },
  {
    id: 'sample-4',
    title: 'Startup Stories',
    description: 'Inspiring stories from entrepreneurs who built successful companies from scratch.',
    author: 'Business Beat',
    authorId: 'sample-user-4',
    createdAt: '2026-01-15',
    duration: '61:20',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    category: 'Business'
  },
  {
    id: 'sample-5',
    title: 'Science Explained',
    description: 'Breaking down complex scientific concepts into easy-to-understand explanations.',
    author: 'Science Simplified',
    authorId: 'sample-user-5',
    createdAt: '2026-01-10',
    duration: '42:00',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    category: 'Science'
  },
  {
    id: 'sample-6',
    title: 'Creative Design Tips',
    description: 'Professional designers share their secrets for creating stunning visual content.',
    author: 'Design Daily',
    authorId: 'sample-user-6',
    createdAt: '2026-01-05',
    duration: '35:50',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    category: 'Design'
  }
]

export const podcastStore = reactive({
  podcasts: [...samplePodcasts],
  loading: false,
  error: null,
  initialized: false,

  // Initialize - load podcasts from API
  async init() {
    if (this.initialized) return
    this.loading = true
    this.error = null
    try {
      const podcasts = await api.getPodcasts()
      // Combine API podcasts with samples
      this.podcasts = [...podcasts, ...samplePodcasts]
      this.initialized = true
    } catch (error) {
      console.warn('API not available, using sample podcasts:', error.message)
      this.podcasts = [...samplePodcasts]
    } finally {
      this.loading = false
    }
  },

  // Get single podcast
  async getPodcast(id) {
    // First check local cache
    let podcast = this.podcasts.find(p => p.id === id || p.id === String(id))
    if (podcast) return podcast

    // Try API
    try {
      podcast = await api.getPodcast(id)
      return podcast
    } catch (error) {
      console.error('Failed to fetch podcast:', error)
      return null
    }
  },

  // Get user's podcasts
  async getUserPodcasts(userId) {
    if (!userId) return []
    try {
      const podcasts = await api.getUserPodcasts(userId)
      return podcasts
    } catch (error) {
      console.warn('Failed to fetch user podcasts:', error.message)
      return []
    }
  },

  // Upload new podcast
  async addPodcast(data, userId) {
    try {
      const podcast = await api.uploadPodcast(data, userId)
      this.podcasts.unshift(podcast)
      return podcast
    } catch (error) {
      console.error('Failed to upload podcast:', error)
      throw error
    }
  },

  // Delete podcast
  async deletePodcast(id, userId) {
    try {
      await api.deletePodcast(id, userId)
      const index = this.podcasts.findIndex(p => p.id === id)
      if (index !== -1) {
        this.podcasts.splice(index, 1)
      }
      return true
    } catch (error) {
      console.error('Failed to delete podcast:', error)
      throw error
    }
  },

  // Get by category
  getByCategory(category) {
    if (!category || category === 'All') return this.podcasts
    return this.podcasts.filter(p => p.category === category)
  },

  // Search
  search(query) {
    const lowercaseQuery = query.toLowerCase()
    return this.podcasts.filter(p =>
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery) ||
      p.author?.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Get image URL (handles both API and external URLs)
  getImageUrl(podcast) {
    if (!podcast) return null
    const url = podcast.imageUrl || podcast.image
    return api.getFileUrl(url)
  },

  // Get audio URL
  getAudioUrl(podcast) {
    if (!podcast) return null
    return api.getFileUrl(podcast.audioUrl)
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })
  }
})
