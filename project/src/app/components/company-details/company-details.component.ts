import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyService } from '../../services/company.service';
import { FavoritesService } from '../../services/favorites.service';
import { Company } from '../../models/company.model';
import { ContactFormComponent } from '../contact/contact-form.component';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <div class="company-details" *ngIf="company$ | async as company">
      <header>
        <img src="assets/logo.png" alt="Altrn'work" class="logo">
        <div class="header-actions">
          <button 
            class="btn-favorite"
            [class.active]="isFavorite(company.id)"
            (click)="toggleFavorite(company.id)">
            {{ isFavorite(company.id) ? '❤️ Favori' : '🤍 Ajouter aux favoris' }}
          </button>
          <button (click)="goBack()" class="btn-back">Retour</button>
        </div>
      </header>

      <div class="content">
        <div class="company-header">
          <h1>{{ company.name }}</h1>
          <div class="rating">
            <span *ngFor="let star of [1,2,3,4,5]">⭐</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-card location">
            <h3>Localisation</h3>
            <p>📍 {{ company.location }}</p>
          </div>

          <div class="info-card sector">
            <h3>Secteur</h3>
            <p>{{ company.sector }}</p>
          </div>

          <div class="info-card size">
            <h3>Taille de l'entreprise</h3>
            <p>{{ company.size }} employés</p>
          </div>

          <div class="info-card hours">
            <h3>Horaires</h3>
            <p>{{ company.working_hours }}</p>
          </div>

          <div class="info-card description">
            <h3>Description</h3>
            <p>{{ company.description }}</p>
          </div>

          <div class="info-card contact">
            <app-contact-form 
              [companyId]="company.id"
              [companyName]="company.name"
              (submitted)="onContactSubmitted($event)"
            ></app-contact-form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ... styles existants ... */
  `]
})
export class CompanyDetailsComponent implements OnInit {
  company$: Observable<Company | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.company$ = this.companyService.getCompanyById(id);
    }
  }

  async toggleFavorite(companyId: string) {
    await this.favoritesService.toggleFavorite(companyId);
  }

  isFavorite(companyId: string): boolean {
    return this.favoritesService.isFavorite(companyId);
  }

  goBack() {
    this.router.navigate(['/companies']);
  }

  onContactSubmitted(formData: any) {
    alert('Votre message a été envoyé avec succès !');
  }
}