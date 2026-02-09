// API service for communicating with the backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = {
  // Get auth headers
  getHeaders(userId) {
    return {
      'X-User-Id': userId || ''
    }
  },

  // Get all podcasts
  async getPodcasts() {
    const response = await fetch(`${API_URL}/api/podcasts`)
    if (!response.ok) throw new Error('Failed to fetch podcasts')
    return response.json()
  },

  // Get single podcast
  async getPodcast(id) {
    const response = await fetch(`${API_URL}/api/podcasts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch podcast')
    return response.json()
  },

  // Get podcasts by user
  async getUserPodcasts(userId) {
    const response = await fetch(`${API_URL}/api/podcasts/user/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch user podcasts')
    return response.json()
  },

  // Upload new podcast
  async uploadPodcast(data, userId) {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('author', data.author || '')
    formData.append('category', data.category || 'Other')
    formData.append('duration', data.duration || '00:00')
    
    if (data.audioFile) {
      formData.append('audio', data.audioFile)
    }
    
    if (data.imageFile) {
      formData.append('image', data.imageFile)
    }

    const response = await fetch(`${API_URL}/api/podcasts`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload podcast')
    }

    return response.json()
  },

  // Delete podcast
  async deletePodcast(id, userId) {
    const response = await fetch(`${API_URL}/api/podcasts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete podcast')
    }

    return response.json()
  },

  // Get full URL for uploads
  getFileUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }
}
