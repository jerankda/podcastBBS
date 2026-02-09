<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">🎙️</span>
            <span class="logo-text">Podcaster</span>
          </div>
          <h1>Willkommen zurück</h1>
          <p>Melde dich an, um fortzufahren</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">E-Mail</label>
            <input 
              type="email" 
              id="email" 
              v-model="email"
              placeholder="Deine E-Mail-Adresse"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Passwort</label>
            <input 
              type="password" 
              id="password" 
              v-model="password"
              placeholder="Dein Passwort"
              required
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Angemeldet bleiben</span>
            </label>
            <a href="#" class="forgot-link">Passwort vergessen?</a>
          </div>
          
          <p v-if="error" class="error-message">{{ error }}</p>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Anmeldung...' : 'Anmelden' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Noch kein Konto? <router-link to="/register">Registrieren</router-link></p>
        </div>
        
        <div class="auth-divider">
          <span>oder fortfahren mit</span>
        </div>
        
        <div class="social-login">
          <button type="button" class="social-btn" @click="handleGoogleLogin" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

async function handleGoogleLogin() {
  loading.value = true
  error.value = ''
  
  const result = await authStore.loginWithGoogle()
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a5a8a 0%, #2980b9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a5a8a;
}

.auth-header h1 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1a5a8a;
  box-shadow: 0 0 0 3px rgba(26, 90, 138, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #555;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-link {
  color: #1a5a8a;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #fdf2f2;
  border-radius: 4px;
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

.btn-block {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.95rem;
}

.auth-footer a {
  color: #1a5a8a;
  font-weight: 500;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #999;
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd;
}

.auth-divider span {
  padding: 0 1rem;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  transition: background 0.2s, border-color 0.2s;
}

.social-btn:hover {
  background: #f8f9fa;
  border-color: #bbb;
}
</style>
