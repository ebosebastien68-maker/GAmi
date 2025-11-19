<template>
  <div class="home-container">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="logo-container">
          <h1 class="logo-text">🎮 GAmi</h1>
          <p class="logo-subtitle">La Fortune en Jeu</p>
        </div>
        <nav class="nav-links">
          <a href="#games" class="nav-link">Jeux</a>
          <a href="#prizes" class="nav-link">Prix</a>
          <a href="#winners" class="nav-link">Gagnants</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-6 text-center">
        <div class="hero-badge">
          ✨ Plateforme N°1 des Concours de Jeux
        </div>
        <h1 class="hero-title">
          Transformez Votre Passion en
          <span class="gradient-text"> Fortune</span>
        </h1>
        <p class="hero-description">
          Participez aux plus grands tournois de jeux africains et remportez des prix extraordinaires. 
          Votre talent mérite d'être récompensé.
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">500K+</div>
            <div class="stat-label">Joueurs Actifs</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">2M€</div>
            <div class="stat-label">Prix Distribués</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Gagnants Quotidiens</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Games Grid Section -->
    <section id="games" class="games-section">
      <div class="container mx-auto px-6">
        <div class="section-header">
          <h2 class="section-title">Choisissez Votre Chemin vers la Victoire</h2>
          <p class="section-subtitle">8 jeux légendaires, des milliers d'opportunités de gagner</p>
        </div>

        <div class="games-grid">
          <!-- Awale Game Card -->
          <div class="game-card" @click="selectGame('Awale')">
            <div class="game-icon">🪨</div>
            <h3 class="game-title">Awale</h3>
            <p class="game-description">Stratégie ancestrale, gains modernes</p>
            <div class="game-prize">Prix jusqu'à 50.000€</div>
            <div class="game-players">🔥 15.2K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Ludo Game Card -->
          <div class="game-card featured" @click="selectGame('Ludo')">
            <div class="featured-badge">⭐ POPULAIRE</div>
            <div class="game-icon">🎲</div>
            <h3 class="game-title">Ludo</h3>
            <p class="game-description">Chance et tactique pour la fortune</p>
            <div class="game-prize">Prix jusqu'à 100.000€</div>
            <div class="game-players">🔥 32.8K joueurs actifs</div>
            <button class="game-button featured-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Dame Game Card -->
          <div class="game-card" @click="selectGame('Dame')">
            <div class="game-icon">👑</div>
            <h3 class="game-title">Dame</h3>
            <p class="game-description">La royauté des jeux de plateau</p>
            <div class="game-prize">Prix jusqu'à 75.000€</div>
            <div class="game-players">🔥 21.5K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Deviner Game Card -->
          <div class="game-card" @click="selectGame('Deviner')">
            <div class="game-icon">🔮</div>
            <h3 class="game-title">Deviner</h3>
            <p class="game-description">Intuition = Richesse</p>
            <div class="game-prize">Prix jusqu'à 30.000€</div>
            <div class="game-players">🔥 18.9K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Course Game Card -->
          <div class="game-card" @click="selectGame('Course')">
            <div class="game-icon">🏁</div>
            <h3 class="game-title">Course</h3>
            <p class="game-description">Vitesse et stratégie payantes</p>
            <div class="game-prize">Prix jusqu'à 60.000€</div>
            <div class="game-players">🔥 27.3K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Pick Game Card -->
          <div class="game-card featured" @click="selectGame('Pick')">
            <div class="featured-badge">🎯 NOUVEAU</div>
            <div class="game-icon">🎰</div>
            <h3 class="game-title">Pick</h3>
            <p class="game-description">Choisissez, gagnez, prospérez</p>
            <div class="game-prize">Prix jusqu'à 120.000€</div>
            <div class="game-players">🔥 41.2K joueurs actifs</div>
            <button class="game-button featured-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Mots Game Card -->
          <div class="game-card" @click="selectGame('Mots')">
            <div class="game-icon">📝</div>
            <h3 class="game-title">Mots</h3>
            <p class="game-description">Vocabulaire = Fortune</p>
            <div class="game-prize">Prix jusqu'à 40.000€</div>
            <div class="game-players">🔥 19.7K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>

          <!-- Vrai ou Faux Game Card -->
          <div class="game-card" @click="selectGame('VraiOuFaux')">
            <div class="game-icon">❓</div>
            <h3 class="game-title">Vrai ou Faux</h3>
            <p class="game-description">Connaissance = Richesse</p>
            <div class="game-prize">Prix jusqu'à 35.000€</div>
            <div class="game-players">🔥 24.1K joueurs actifs</div>
            <button class="game-button">
              Jouer Maintenant
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container mx-auto px-6 text-center">
        <h2 class="cta-title">Prêt à Changer Votre Vie ?</h2>
        <p class="cta-description">
          Rejoignez des milliers de gagnants qui ont transformé leur passion en revenus
        </p>
        <button class="cta-button" @click="selectGame('Inscription')">
          Commencer à Gagner Maintenant
          <span class="cta-arrow">🚀</span>
        </button>
        <div class="trust-badges">
          <span class="badge">🔒 100% Sécurisé</span>
          <span class="badge">⚡ Paiements Instantanés</span>
          <span class="badge">🏆 Certifié & Licencié</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container mx-auto px-6 py-8">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">🎮 GAmi</h3>
            <p class="footer-text">La plateforme qui transforme le jeu en fortune</p>
          </div>
          <div class="footer-section">
            <h4 class="footer-heading">Jeux</h4>
            <ul class="footer-links">
              <li>Awale</li>
              <li>Ludo</li>
              <li>Dame</li>
              <li>Deviner</li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-heading">Support</h4>
            <ul class="footer-links">
              <li>Aide</li>
              <li>Règlement</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-heading">Légal</h4>
            <ul class="footer-links">
              <li>Conditions</li>
              <li>Confidentialité</li>
              <li>Licences</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 GAmi. Tous droits réservés. Jouez responsablement.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  emits: ['navigate'],
  setup(_, { emit }) {
    const selectGame = (gameName: string) => {
      emit('navigate', { component: 'Sign', game: gameName });
    };

    return {
      selectGame
    };
  }
});
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
}

/* Header Styles */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(217, 119, 6, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #d97706, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #92400e;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #78350f;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #d97706;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #d97706, #f59e0b);
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

/* Hero Section */
.hero-section {
  padding: 6rem 0 4rem;
  background: radial-gradient(circle at top, rgba(251, 191, 36, 0.2), transparent 70%);
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #fbbf24;
  border-radius: 50px;
  color: #78350f;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  color: #78350f;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #d97706, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.hero-description {
  font-size: 1.25rem;
  color: #92400e;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.8;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  color: #92400e;
  font-weight: 600;
  margin-top: 0.5rem;
}

.stat-divider {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #fbbf24, transparent);
}

/* Games Section */
.games-section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #78350f;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #92400e;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.game-card {
  background: linear-gradient(135deg, #ffffff, #fef3c7);
  border: 2px solid #fde68a;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.1);
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
  transition: left 0.6s;
}

.game-card:hover::before {
  left: 100%;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(217, 119, 6, 0.25);
  border-color: #fbbf24;
}

.game-card.featured {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 3px solid #f59e0b;
  box-shadow: 0 8px 30px rgba(217, 119, 6, 0.2);
}

.featured-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);
}

.game-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.game-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #78350f;
  margin-bottom: 0.5rem;
}

.game-description {
  color: #92400e;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.game-prize {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
}

.game-players {
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.game-button {
  background: linear-gradient(135deg, #78350f, #92400e);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(120, 53, 15, 0.3);
}

.game-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(120, 53, 15, 0.4);
}

.featured-button {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4);
}

.arrow {
  transition: transform 0.3s;
}

.game-button:hover .arrow {
  transform: translateX(5px);
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #fef3c7, #fde68a, #fbbf24);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: move-background 20s linear infinite;
}

@keyframes move-background {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  color: #78350f;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.cta-description {
  font-size: 1.3rem;
  color: #92400e;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.cta-button {
  background: linear-gradient(135deg, #78350f, #92400e);
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 15px;
  font-weight: 800;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(120, 53, 15, 0.4);
  position: relative;
  z-index: 1;
}

.cta-button:hover {
  transform: scale(1.08);
  box-shadow: 0 15px 40px rgba(120, 53, 15, 0.5);
}

.cta-arrow {
  font-size: 1.5rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.badge {
  background: white;
  color: #78350f;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(120, 53, 15, 0.2);
}

/* Footer */
.footer {
  background: linear-gradient(135deg, #78350f, #92400e);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.footer-text {
  color: #fde68a;
  font-size: 0.9rem;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fbbf24;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links li {
  color: #fde68a;
  cursor: pointer;
  transition: color 0.3s;
}

.footer-links li:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(251, 191, 36, 0.3);
  color: #fde68a;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-divider {
    display: none;
  }

  .section-title {
    font-size: 2rem;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none;
  }

  .cta-title {
    font-size: 2rem;
  }

  .trust-badges {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
