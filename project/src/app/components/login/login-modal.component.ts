import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal($event)">
      <div class="modal-content">
        <button class="close-btn" (click)="close()">×</button>
        <h2>{{ isLoginMode ? 'Connexion' : 'Inscription' }}</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="email" 
              name="email" 
              required
              email
              #emailInput="ngModel"
              [class.error]="emailInput.invalid && emailInput.touched"
            >
            <div class="error-message" *ngIf="emailInput.invalid && emailInput.touched">
              Email invalide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password" 
              name="password" 
              required
              minlength="6"
              #passwordInput="ngModel"
              [class.error]="passwordInput.invalid && passwordInput.touched"
            >
            <div class="error-message" *ngIf="passwordInput.invalid && passwordInput.touched">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <div class="error-message" *ngIf="loginError">
            {{ loginError }}
          </div>

          <button 
            type="submit" 
            class="btn-primary"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'S\'inscrire') }}
          </button>
        </form>

        <div class="signup-link">
          {{ isLoginMode ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
          <a href="#" (click)="toggleMode($event)">
            {{ isLoginMode ? 'S\'inscrire' : 'Se connecter' }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input.error {
      border-color: #ff4444;
    }

    .error-message {
      color: #ff4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #ff6b00;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .signup-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }

    .signup-link a {
      color: #ff6b00;
      text-decoration: none;
      margin-left: 0.5rem;
    }
  `]
})
export class LoginModalComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginError: string = '';
  isLoginMode: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close() {
    // TODO: Implement close logic
  }

  async onSubmit() {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.loginError = '';

    try {
      const success = this.isLoginMode
        ? await this.authService.login(this.email, this.password)
        : await this.authService.register(this.email, this.password);

      if (success) {
        this.router.navigate(['/dashboard']);
        this.close();
      } else {
        this.loginError = this.isLoginMode
          ? 'Email ou mot de passe incorrect'
          : 'Erreur lors de l\'inscription';
      }
    } catch (error) {
      this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
    this.loginError = '';
  }
}