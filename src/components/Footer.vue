<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="logo-placeholder">
            <span class="logo-icon">🎙️</span>
            <div class="logo-text">
              <span class="logo-title">Podcaster</span>
              <span class="logo-subtitle">Deine Podcast Plattform</span>
            </div>
          </div>
          <p class="footer-description">
            Entdecke, höre und teile großartige Podcasts von Creatorn aus aller Welt.
          </p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4>Plattform</h4>
            <router-link to="/browse">Podcasts durchsuchen</router-link>
            <router-link to="/upload">Hochladen</router-link>
            <router-link to="/">Kategorien</router-link>
          </div>
          
          <div class="footer-column">
            <h4>Konto</h4>
            <router-link to="/login">Anmelden</router-link>
            <router-link to="/register">Registrieren</router-link>
            <router-link to="/account">Einstellungen</router-link>
          </div>
          
          <div class="footer-column">
            <h4>Kontakt</h4>
            <a href="mailto:info@podcaster.com">info@podcaster.com</a>
            <a href="#">Support</a>
            <a href="#">FAQ</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 Podcaster. Alle Rechte vorbehalten.</p>
        <div class="footer-legal">
          <a href="#">Datenschutz</a>
          <a href="#">Nutzungsbedingungen</a>
          <a href="#">Cookie-Richtlinie</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #1a5a8a;
  color: white;
  padding: 3rem 1.5rem 1.5rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.logo-subtitle {
  font-size: 0.7rem;
  opacity: 0.8;
}

.footer-description {
  opacity: 0.8;
  line-height: 1.6;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-column a {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.footer-legal {
  display: flex;
  gap: 1.5rem;
}

.footer-legal a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-legal a:hover {
  color: white;
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-legal {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
