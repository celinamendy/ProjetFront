import { Routes } from '@angular/router';
import { LoginComponent } from './composants/auth/login/login.component';
import { RegisterComponent } from './composants/auth/register/register.component';
import { TrajetComponent } from './Models/trajet/trajet.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
// routes pour le conducteur
{ path: 'trajet', component: TrajetComponent },


];



