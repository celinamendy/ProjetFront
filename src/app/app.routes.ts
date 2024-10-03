import { Routes } from '@angular/router';
import { LoginComponent } from './composants/auth/login/login.component';
import { RegisterComponent } from './composants/auth/register/register.component';

import { AccueilComponent } from './composants/accueil/accueil.component';
import { TrajetComponent } from './composants/trajet/trajet.component';
import { AjouterTrajetComponent } from './composants/trajet/ajouter/ajouter.component';
import { ModificationTrajetComponent } from './composants/trajet/modifier/modifier.component';


export const routes: Routes = [
  { path: "", redirectTo: "accueil", pathMatch: 'full' },
  { path: "accueil", component: AccueilComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "trajet", component: TrajetComponent },
  { path: "ajout", component: AjouterTrajetComponent }, // Route pour AjouterTrajetComponent
  { path: 'trajet/modifier/:id', component: ModificationTrajetComponent }

];



