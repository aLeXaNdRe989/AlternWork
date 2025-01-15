import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header>
        <img src="assets/logo.png" alt="Altrn'work" class="logo">
        <nav>
          <button (click)="goToFavorites()" class="btn-nav">Mes Favoris</button>
          <button (click)="logout()" class="btn-logout">Déconnexion</button>
        </nav>
      </header>

      <div class="dashboard-content">
        <!-- ... Reste du contenu ... -->
      </div>
    </div>
  `,
  styles: [`
    /* ... Styles existants ... */
    
    nav {
      display: flex;
      gap: 1rem;
    }

    .btn-nav {
      background: #4a90e2;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-nav:hover {
      background: #357abd;
      transform: translateY(-2px);
    }
  `]
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }
}