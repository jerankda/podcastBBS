<template>
  <div class="account-page">
    <div class="container">
      <div class="account-header">
        <h1>Kontoeinstellungen</h1>
        <p>Verwalte dein Profil und deine Einstellungen</p>
      </div>
      
      <div class="account-content">
        <nav class="account-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span v-html="tab.icon"></span>
            {{ tab.label }}
          </button>
        </nav>
        
        <main class="account-main">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <h2>Profilinformationen</h2>
            
            <div class="avatar-section">
              <div class="avatar" @click="triggerAvatarUpload">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="Avatar" />
                <span v-else class="avatar-placeholder">{{ user.name?.charAt(0) || 'U' }}</span>
              </div>
              <input 
                type="file" 
                ref="avatarInput" 
                accept="image/*" 
                @change="onAvatarSelect" 
                hidden 
              />
              <div class="avatar-actions">
                <button type="button" class="btn btn-outline btn-sm" @click="triggerAvatarUpload">Avatar ändern</button>
                <button v-if="avatarPreview || user.avatar" type="button" class="btn btn-text btn-sm" @click="removeAvatar">Entfernen</button>
              </div>
            </div>
            
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="name">Vollständiger Name</label>
                <input type="text" id="name" v-model="profileForm.name" />
              </div>
              
              <div class="form-group">
                <label for="email">E-Mail-Adresse</label>
                <input type="email" id="email" v-model="profileForm.email" />
              </div>
              
              <div class="form-group">
                <label for="bio">Über mich</label>
                <textarea id="bio" v-model="profileForm.bio" rows="3" placeholder="Erzähl uns etwas über dich..."></textarea>
              </div>
              
              <div class="form-group">
                <label for="website">Webseite</label>
                <input type="url" id="website" v-model="profileForm.website" placeholder="https://" />
              </div>
              
              <p v-if="profileSuccess" class="success-message">{{ profileSuccess }}</p>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Änderungen speichern</button>
              </div>
            </form>
          </div>
          
          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="tab-content">
            <h2>Sicherheitseinstellungen</h2>
            
            <form @submit.prevent="updatePassword" class="security-form">
              <h3>Passwort ändern</h3>
              
              <div class="form-group">
                <label for="currentPassword">Aktuelles Passwort</label>
                <input type="password" id="currentPassword" v-model="passwordForm.current" />
              </div>
              
              <div class="form-group">
                <label for="newPassword">Neues Passwort</label>
                <input type="password" id="newPassword" v-model="passwordForm.new" />
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Neues Passwort bestätigen</label>
                <input type="password" id="confirmPassword" v-model="passwordForm.confirm" />
              </div>
              
              <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
              <p v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</p>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Passwort aktualisieren</button>
              </div>
            </form>
            
            <div class="security-section">
              <h3>Zwei-Faktor-Authentifizierung</h3>
              <p>Füge eine zusätzliche Sicherheitsebene zu deinem Konto hinzu.</p>
              <button class="btn btn-outline">2FA aktivieren</button>
            </div>
            
            <div class="security-section">
              <h3>Aktive Sitzungen</h3>
              <div class="session-item">
                <div class="session-info">
                  <span class="session-device">Chrome auf macOS</span>
                  <span class="session-location">Aktuelle Sitzung</span>
                </div>
                <span class="session-badge">Aktiv</span>
              </div>
            </div>
          </div>
          
          <!-- My Podcasts Tab -->
          <div v-if="activeTab === 'podcasts'" class="tab-content">
            <h2>Meine Podcasts</h2>
            
            <div v-if="loadingPodcasts" class="loading-state">
              <p>Deine Podcasts werden geladen...</p>
            </div>
            
            <div v-else-if="myPodcasts.length > 0" class="my-podcasts-list">
              <div v-for="podcast in myPodcasts" :key="podcast.id" class="my-podcast-item">
                <div class="my-podcast-image">
                  <img v-if="podcast.imageUrl" :src="podcastStore.getImageUrl(podcast)" :alt="podcast.title" />
                  <div v-else class="my-podcast-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                </div>
                <div class="podcast-details">
                  <h4>{{ podcast.title }}</h4>
                  <p>{{ podcastStore.formatDate(podcast.createdAt) }} • {{ podcast.duration }}</p>
                </div>
                <div class="podcast-actions">
                  <router-link :to="`/podcast/${podcast.id}`" class="btn btn-outline btn-sm">Ansehen</router-link>
                  <button class="btn btn-danger btn-sm" @click="deletePodcast(podcast.id)">Löschen</button>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <h3>Noch keine Podcasts</h3>
              <p>Beginne, deine Stimme mit der Welt zu teilen!</p>
              <router-link to="/upload" class="btn btn-primary">Ersten Podcast hochladen</router-link>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { authStore } from '../stores/auth'
import { podcastStore } from '../stores/podcasts'

const user = computed(() => authStore.user || {})
const activeTab = ref('profile')
const myPodcasts = ref([])
const loadingPodcasts = ref(false)

const tabs = [
  { id: 'profile', label: 'Profil', icon: '👤' },
  { id: 'security', label: 'Sicherheit', icon: '🔒' },
  { id: 'podcasts', label: 'Meine Podcasts', icon: '🎙️' }
]

const profileForm = reactive({
  name: user.value.name || '',
  email: user.value.email || '',
  bio: '',
  website: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const avatarInput = ref(null)
const avatarPreview = ref(null)
const avatarFile = ref(null)

const profileSuccess = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')

// Load user's podcasts
async function loadMyPodcasts() {
  if (!authStore.user?.id) return
  loadingPodcasts.value = true
  try {
    myPodcasts.value = await podcastStore.getUserPodcasts(authStore.user.id)
  } catch (error) {
    console.error('Failed to load podcasts:', error)
  } finally {
    loadingPodcasts.value = false
  }
}

onMounted(() => {
  loadMyPodcasts()
})

async function updateProfile() {
  const result = await authStore.updateProfile({
    name: profileForm.name,
    avatar: avatarPreview.value || undefined
  })
  if (result.success) {
    profileSuccess.value = 'Profil erfolgreich aktualisiert!'
    setTimeout(() => {
      profileSuccess.value = ''
    }, 3000)
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  if (!passwordForm.current) {
    passwordError.value = 'Bitte gib dein aktuelles Passwort ein'
    return
  }
  
  if (passwordForm.new !== passwordForm.confirm) {
    passwordError.value = 'Die Passwörter stimmen nicht überein'
    return
  }
  
  if (passwordForm.new.length < 6) {
    passwordError.value = 'Das Passwort muss mindestens 6 Zeichen haben'
    return
  }
  
  const result = await authStore.updatePassword(passwordForm.current, passwordForm.new)
  
  if (result.success) {
    passwordSuccess.value = 'Passwort erfolgreich aktualisiert!'
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    
    setTimeout(() => {
      passwordSuccess.value = ''
    }, 3000)
  } else {
    passwordError.value = result.error
  }
}

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

function onAvatarSelect(event) {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  avatarPreview.value = null
  avatarFile.value = null
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
  // Hier könnte man auch den Avatar im Auth Store entfernen
}

async function deletePodcast(podcastId) {
  if (confirm('Bist du sicher, dass du diesen Podcast löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
    try {
      await podcastStore.deletePodcast(podcastId, authStore.user.id)
      // Reload the list
      await loadMyPodcasts()
    } catch (error) {
      alert('Podcast konnte nicht gelöscht werden: ' + error.message)
    }
  }
}
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 1.5rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.account-header {
  margin-bottom: 2rem;
}

.account-header h1 {
  font-size: 2rem;
  color: #1a5a8a;
  margin-bottom: 0.5rem;
}

.account-header p {
  color: #666;
}

.account-content {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.account-nav {
  background: #f8f9fa;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  text-align: left;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: white;
  color: #1a5a8a;
}

.nav-btn.active {
  background: white;
  color: #1a5a8a;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.account-main {
  padding: 2rem;
}

.tab-content h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e0e0e0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #1a5a8a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1a5a8a;
  box-shadow: 0 0 0 3px rgba(26, 90, 138, 0.1);
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.95rem;
  text-decoration: none;
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

.btn-text {
  background: transparent;
  color: #666;
  padding: 0.5rem;
}

.btn-text:hover {
  color: #333;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.security-form h3,
.security-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.security-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.security-section p {
  color: #666;
  margin-bottom: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.session-device {
  font-weight: 500;
  color: #333;
  display: block;
}

.session-location {
  font-size: 0.85rem;
  color: #666;
}

.session-badge {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.notification-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.toggle-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.toggle-option:last-child {
  border-bottom: none;
}

.toggle-option strong {
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
}

.toggle-option p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.toggle-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.my-podcasts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.my-podcast-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.my-podcast-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  flex-shrink: 0;
}

.my-podcast-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.my-podcast-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.podcast-details {
  flex: 1;
}

.podcast-details h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.podcast-details p {
  font-size: 0.85rem;
  color: #666;
}

.podcast-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.danger-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #fff8f8;
  border: 1px solid #ffe0e0;
  border-radius: 8px;
}

.danger-item h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.danger-item p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
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

@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
  }
  
  .account-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .nav-btn {
    white-space: nowrap;
    padding: 0.75rem 1rem;
  }
  
  .danger-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
