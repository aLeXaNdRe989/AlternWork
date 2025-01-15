import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container fade-in">
      <header>
        <div class="logo-container">
          <img src="assets/logo.png" alt="Altrn'work" class="logo">
        </div>
        <button (click)="openLoginModal()" class="btn-primary">
          <span class="icon">👤</span>
          Mon Espace
        </button>
      </header>
      
      <main class="main-content">
        <h1 class="title">ALTRN'WORK C'EST QUOI ?</h1>
        <p class="subtitle">La plateforme qui révolutionne le monde du travail</p>
        
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Innovation</h3>
            <p>Des solutions modernes pour les entreprises d'aujourd'hui</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Collaboration</h3>
            <p>Connectez-vous avec les meilleurs talents</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3>Flexibilité</h3>
            <p>Adaptez votre travail à votre style de vie</p>
          </div>
        </div>

        <div class="cta-section">
          <button routerLink="/companies" class="btn-secondary">
            <span class="icon">🏢</span>
            Découvrir les entreprises
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4rem;
      padding: 1rem 0;
    }

    .logo-container {
      display: flex;
      align-items: center;
    }

    .logo {
      height: 50px;
      width: auto;
      object-fit: contain;
    }

    .main-content {
      text-align: center;
      margin-top: 2rem;
    }

    .title {
      font-size: 3rem;
      font-weight: 800;
      color: #2c3e50;
      margin-bottom: 1rem;
      letter-spacing: -1px;
    }

    .subtitle {
      font-size: 1.5rem;
      color: #666;
      margin-bottom: 4rem;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 4rem 0;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      margin-top: 4rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .title {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1.2rem;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  openLoginModal() {
    // TODO: Implement login modal
  }
}