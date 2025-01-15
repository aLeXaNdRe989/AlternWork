import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-form">
      <h2>Nous Contacter</h2>
      <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
        <div class="form-group">
          <label for="name">Nom complet</label>
          <input 
            type="text" 
            id="name"
            name="name"
            [(ngModel)]="formData.name"
            required
            #nameInput="ngModel"
            [class.error]="nameInput.invalid && nameInput.touched"
          >
          <div class="error-message" *ngIf="nameInput.invalid && nameInput.touched">
            Le nom est requis
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            [(ngModel)]="formData.email"
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
          <label for="subject">Sujet</label>
          <input 
            type="text" 
            id="subject"
            name="subject"
            [(ngModel)]="formData.subject"
            required
            #subjectInput="ngModel"
            [class.error]="subjectInput.invalid && subjectInput.touched"
          >
          <div class="error-message" *ngIf="subjectInput.invalid && subjectInput.touched">
            Le sujet est requis
          </div>
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message"
            name="message"
            [(ngModel)]="formData.message"
            required
            rows="5"
            #messageInput="ngModel"
            [class.error]="messageInput.invalid && messageInput.touched"
          ></textarea>
          <div class="error-message" *ngIf="messageInput.invalid && messageInput.touched">
            Le message est requis
          </div>
        </div>

        <div class="error-message" *ngIf="submitError">
          {{ submitError }}
        </div>

        <button 
          type="submit" 
          class="btn-submit"
          [disabled]="contactForm.invalid || isSubmitting"
        >
          {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    /* ... Styles existants ... */
  `]
})
export class ContactFormComponent {
  @Input() companyId!: string;
  @Input() companyName?: string;
  @Output() submitted = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitError = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  async onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitError = '';

    try {
      const user = await this.authService.getCurrentUser();
      
      const success = await this.contactService.sendMessage({
        ...this.formData,
        company_id: this.companyId,
        user_id: user?.id
      });

      if (success) {
        this.submitted.emit(this.formData);
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      } else {
        this.submitError = 'Une erreur est survenue lors de l\'envoi du message.';
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      this.submitError = 'Une erreur est survenue. Veuillez réessayer.';
    } finally {
      this.isSubmitting = false;
    }
  }
}