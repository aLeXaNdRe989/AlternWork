import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id', component: CompanyDetailsComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
];