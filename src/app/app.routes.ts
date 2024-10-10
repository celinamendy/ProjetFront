import { Routes } from '@angular/router';
import { LoginComponent } from './composants/auth/login/login.component';
import { RegisterComponent } from './composants/auth/register/register.component';

import { AccueilComponent } from './composants/accueil/accueil.component';
import { TrajetComponent } from './composants/trajet/trajet.component';
import { AjouterTrajetComponent } from './composants/trajet/ajouter/ajouter.component';
import { ModificationTrajetComponent } from './composants/trajet/modifier/modifier.component';
import { Vehicule } from './Models/vehicule/vehicule.component';
import { DetailTrajetComponent } from './composants/trajet/detail/detail.component';
import { HistoriqueTrajetComponent } from './composants/trajet/historique/historique.component';
import { AjouterComponent } from './composants/vehicule/ajouter/ajouter.component';

export const routes: Routes = [
  { path: "", redirectTo: "accueil", pathMatch: 'full' },
  { path: "accueil", component: AccueilComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "trajet", component: TrajetComponent },
  { path: "historique", component: HistoriqueTrajetComponent },

  { path: 'ajout', component: AjouterTrajetComponent } ,// Page d'ajout de trajet
  { path: 'trajet/modifier/:id', component: ModificationTrajetComponent },
  { path: 'trajet/:id', component: DetailTrajetComponent }, // Route pour afficher les détails du trajet


  { path: 'ajouter-vehicule', component: AjouterComponent }, // Route pour ajouter un véhicule
  { path: 'liste-vehicules', component: AjouterComponent}, // Route pour la liste des véhicules
  { path: 'vehicule/:id', component: AjouterComponent },
];



