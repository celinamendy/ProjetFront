import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  constructor(private authService: AuthService) { }

  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }

}
