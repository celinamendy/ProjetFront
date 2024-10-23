import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf, // Angular's built-in NgIf directive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
// Définir isLoggedIn() pour vérifier si l'utilisateur est connecté
isLoggedIn(): boolean {
  return this.authService.isLoggedIn(); // Utilisation de la méthode isLoggedIn() du service AuthService
}
  logout() {
    this.authService.logout(); // Call your logout service here
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }

}
