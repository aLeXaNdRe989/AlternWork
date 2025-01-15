import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyService } from '../../services/company.service';
import { FavoritesService } from '../../services/favorites.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Template existant -->
  `,
  styles: [`
    /* Styles existants */
  `]
})
export class FavoritesComponent {
  favoriteCompanies$: Observable<Company[]>;

  constructor(
    private companyService: CompanyService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    this.favoriteCompanies$ = combineLatest([
      this.companyService.companies$,
      this.favoritesService.favorites$
    ]).pipe(
      map(([companies, favoriteIds]) =>
        companies.filter(company => favoriteIds.includes(company.id))
      )
    );
  }

  viewCompanyDetails(id: string) {
    this.router.navigate(['/companies', id]);
  }

  async removeFavorite(event: Event, companyId: string) {
    event.stopPropagation();
    await this.favoritesService.toggleFavorite(companyId);
  }

  goBack() {
    this.router.navigate(['/companies']);
  }

  goToCompanies() {
    this.router.navigate(['/companies']);
  }
}