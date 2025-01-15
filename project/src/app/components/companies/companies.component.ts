import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyService } from '../../services/company.service';
import { FavoritesService } from '../../services/favorites.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Template reste inchangé -->
  `,
  styles: [`
    /* Styles restent inchangés */
  `]
})
export class CompaniesComponent implements OnInit {
  companies$: Observable<Company[]>;
  searchTerm: string = '';
  selectedRegion: string = '';
  selectedSector: string = '';
  selectedSize: string = '';
  selectedWorkingHours: string = '';

  regions = ['ILE DE FRANCE', 'PACA', 'OCCITANIE'];
  sectors = ['Tech', 'Luxe', 'Santé', 'Restauration'];
  companySizes = ['1-10', '10-50', '50-100', '100+'];
  workingHours = ['Flexible', 'Standard'];

  constructor(
    private companyService: CompanyService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    this.companies$ = this.companyService.companies$;
  }

  ngOnInit() {
    // Les données sont chargées automatiquement par le service
  }

  onSearch(term: string) {
    this.companyService.search(term);
  }

  filterByRegion(region: string) {
    this.selectedRegion = this.selectedRegion === region ? '' : region;
    this.companyService.filterByRegion(this.selectedRegion);
  }

  filterBySector(sector: string) {
    this.selectedSector = this.selectedSector === sector ? '' : sector;
    this.companyService.filterBySector(this.selectedSector);
  }

  filterBySize(size: string) {
    this.selectedSize = this.selectedSize === size ? '' : size;
    this.companyService.filterBySize(this.selectedSize);
  }

  filterByWorkingHours(hours: string) {
    this.selectedWorkingHours = this.selectedWorkingHours === hours ? '' : hours;
    this.companyService.filterByWorkingHours(this.selectedWorkingHours);
  }

  resetFilters() {
    this.selectedRegion = '';
    this.selectedSector = '';
    this.selectedSize = '';
    this.selectedWorkingHours = '';
    this.searchTerm = '';
    this.companyService.resetFilters();
  }

  async toggleFavorite(event: Event, companyId: string) {
    event.stopPropagation();
    await this.favoritesService.toggleFavorite(companyId);
  }

  isFavorite(companyId: string): boolean {
    return this.favoritesService.isFavorite(companyId);
  }

  viewCompanyDetails(id: string) {
    this.router.navigate(['/companies', id]);
  }
}