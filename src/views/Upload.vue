<template>
  <div class="upload-page">
    <div class="container">
      <div class="upload-header">
        <h1>Podcast hochladen</h1>
        <p>Teile deine Inhalte mit unserer Community</p>
      </div>
      
      <div class="upload-content">
        <form @submit.prevent="handleUpload" class="upload-form">
          <!-- Cover Image -->
          <div class="form-section">
            <h3>Titelbild</h3>
            <div 
              class="image-upload"
              :class="{ 'has-image': coverPreview }"
              @click="triggerImageUpload"
              @dragover.prevent="onDragOver"
              @dragleave="onDragLeave"
              @drop.prevent="onImageDrop"
            >
              <input 
                type="file" 
                ref="imageInput"
                accept="image/*"
                @change="onImageSelect"
                hidden
              />
              <img v-if="coverPreview" :src="coverPreview" alt="Vorschau" />
              <div v-else class="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>Klicken oder Bild hierher ziehen</p>
                <span>Empfohlen: 400x300px</span>
              </div>
            </div>
          </div>
          
          <!-- Podcast Details -->
          <div class="form-section">
            <h3>Podcast Details</h3>
            
            <div class="form-group">
              <label for="title">Titel *</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title"
                placeholder="Podcast-Titel eingeben"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="description">Beschreibung *</label>
              <textarea 
                id="description" 
                v-model="form.description"
                placeholder="Beschreibe deine Podcast-Episode..."
                rows="4"
                required
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Kategorie</label>
                <select id="category" v-model="form.category">
                  <option value="">Kategorie wählen</option>
                  <option value="Technology">Technologie</option>
                  <option value="Business">Business</option>
                  <option value="Science">Wissenschaft</option>
                  <option value="Design">Design</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Entertainment">Unterhaltung</option>
                  <option value="Education">Bildung</option>
                  <option value="Other">Sonstiges</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="author">Autor</label>
                <input 
                  type="text" 
                  id="author" 
                  v-model="form.author"
                  placeholder="Dein Name oder Showname"
                />
              </div>
            </div>
          </div>
          
          <!-- Audio File -->
          <div class="form-section">
            <h3>Audiodatei</h3>
            <div 
              class="audio-upload"
              :class="{ 'has-file': audioFile }"
              @click="triggerAudioUpload"
              @dragover.prevent="onDragOver"
              @dragleave="onDragLeave"
              @drop.prevent="onAudioDrop"
            >
              <input 
                type="file" 
                ref="audioInput"
                accept="audio/*"
                @change="onAudioSelect"
                hidden
              />
              <div v-if="audioFile" class="audio-file-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                <div class="audio-details">
                  <span class="audio-name">{{ audioFile.name }}</span>
                  <span class="audio-size">{{ formatFileSize(audioFile.size) }}</span>
                </div>
                <button type="button" class="remove-btn" @click.stop="removeAudio">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div v-else class="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                <p>Klicken oder Audiodatei hierher ziehen</p>
                <span>MP3, WAV, M4A bis 500MB</span>
              </div>
            </div>
          </div>
          
          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>
          
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="resetForm">
              Zurücksetzen
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Wird hochgeladen...' : 'Podcast hochladen' }}
            </button>
          </div>
        </form>
        
        <aside class="upload-sidebar">
          <div class="sidebar-box">
            <h3>Upload-Richtlinien</h3>
            <ul class="guidelines-list">
              <li>Hochwertige Audio verwenden (128kbps+)</li>
              <li>Aussagekräftigen Titel hinzufügen</li>
              <li>Relevante Tags einfügen</li>
              <li>Ansprechendes Titelbild wählen</li>
              <li>Ausführliche Beschreibung schreiben</li>
            </ul>
          </div>
          
          <div class="sidebar-box">
            <h3>Unterstützte Formate</h3>
            <div class="formats">
              <span class="format-tag">MP3</span>
              <span class="format-tag">WAV</span>
              <span class="format-tag">M4A</span>
              <span class="format-tag">OGG</span>
              <span class="format-tag">FLAC</span>
            </div>
          </div>
          
          <div class="sidebar-box">
            <h3>Hilfe benötigt?</h3>
            <p>Schau dir unsere <a href="#">Anleitung</a> an oder kontaktiere den <a href="#">Support</a>.</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { podcastStore } from '../stores/podcasts'
import { authStore } from '../stores/auth'

const router = useRouter()

const imageInput = ref(null)
const audioInput = ref(null)
const coverPreview = ref(null)
const coverFile = ref(null)
const audioFile = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const uploadProgress = ref(0)

const form = reactive({
  title: '',
  description: '',
  category: '',
  author: authStore.user?.name || ''
})

function triggerImageUpload() {
  imageInput.value?.click()
}

function triggerAudioUpload() {
  audioInput.value?.click()
}

function onImageSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processImage(file)
  }
}

function onAudioSelect(event) {
  const file = event.target.files[0]
  if (file) {
    audioFile.value = file
  }
}

function onDragOver(event) {
  event.target.classList.add('drag-over')
}

function onDragLeave(event) {
  event.target.classList.remove('drag-over')
}

function onImageDrop(event) {
  event.target.classList.remove('drag-over')
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

function onAudioDrop(event) {
  event.target.classList.remove('drag-over')
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('audio/')) {
    audioFile.value = file
  }
}

function processImage(file) {
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeAudio() {
  audioFile.value = null
  if (audioInput.value) {
    audioInput.value.value = ''
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.category = ''
  form.author = authStore.user?.name || ''
  coverPreview.value = null
  coverFile.value = null
  audioFile.value = null
  error.value = ''
  success.value = ''
  uploadProgress.value = 0
  if (imageInput.value) imageInput.value.value = ''
  if (audioInput.value) audioInput.value.value = ''
}

async function handleUpload() {
  if (!form.title || !form.description) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  if (!audioFile.value) {
    error.value = 'Please upload an audio file'
    return
  }
  
  if (!authStore.user) {
    error.value = 'You must be logged in to upload'
    return
  }
  
  loading.value = true
  error.value = ''
  uploadProgress.value = 0
  
  try {
    // Get audio duration
    const duration = await getAudioDuration(audioFile.value)
    
    // Upload to server
    const newPodcast = await podcastStore.addPodcast({
      title: form.title,
      description: form.description,
      category: form.category || 'Other',
      author: form.author || authStore.user.name || 'Anonymous',
      audioFile: audioFile.value,
      imageFile: coverFile.value,
      duration: formatDuration(duration)
    }, authStore.user.id)
    
    success.value = 'Podcast uploaded successfully!'
    
    setTimeout(() => {
      router.push(`/podcast/${newPodcast.id}`)
    }, 1500)
    
  } catch (e) {
    error.value = e.message || 'Upload failed. Please try again.'
  } finally {
    loading.value = false
  }
}

function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.onloadedmetadata = () => {
      resolve(audio.duration)
    }
    audio.onerror = () => {
      resolve(0)
    }
    audio.src = URL.createObjectURL(file)
  })
}

function formatDuration(seconds) {
  if (!seconds) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.upload-header {
  margin-bottom: 2rem;
}

.upload-header h1 {
  font-size: 2rem;
  color: #1a5a8a;
  margin-bottom: 0.5rem;
}

.upload-header p {
  color: #666;
}

.upload-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.upload-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1a5a8a;
}

.image-upload,
.audio-upload {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.image-upload:hover,
.audio-upload:hover,
.image-upload.drag-over,
.audio-upload.drag-over {
  border-color: #1a5a8a;
  background: rgba(26, 90, 138, 0.05);
}

.image-upload.has-image {
  padding: 0;
  border-style: solid;
}

.image-upload.has-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 6px;
}

.upload-placeholder {
  color: #999;
}

.upload-placeholder svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.upload-placeholder p {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.upload-placeholder span {
  font-size: 0.85rem;
  opacity: 0.7;
}

.audio-file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.audio-file-info svg {
  color: #1a5a8a;
}

.audio-details {
  flex: 1;
}

.audio-name {
  display: block;
  font-weight: 500;
  color: #333;
}

.audio-size {
  font-size: 0.85rem;
  color: #666;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c;
  padding: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1a5a8a;
  box-shadow: 0 0 0 3px rgba(26, 90, 138, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  color: #27ae60;
  background: #f0fdf4;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.875rem 1.5rem;
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

.btn-primary:disabled {
  background: #93c5e4;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #bbb;
}

.upload-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-box h3 {
  font-size: 1rem;
  color: #1a5a8a;
  margin-bottom: 1rem;
}

.guidelines-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guidelines-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #555;
  font-size: 0.9rem;
}

.guidelines-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
}

.formats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.format-tag {
  background: #e8f4fc;
  color: #1a5a8a;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.sidebar-box p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.sidebar-box a {
  color: #1a5a8a;
  text-decoration: none;
}

.sidebar-box a:hover {
  text-decoration: underline;
}

@media (max-width: 992px) {
  .upload-content {
    grid-template-columns: 1fr;
  }
  
  .upload-sidebar {
    order: -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .upload-sidebar {
    grid-template-columns: 1fr;
  }
}
</style>
