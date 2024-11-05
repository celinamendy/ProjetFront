import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { NotificationsService } from '../../services/notifications.service'; // Assurez-vous que le chemin est correct
import { HeaderComponent } from '../header/header.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    HeaderComponent, NgIf
    ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  notifications: any[] = [];
  notificationCount: number = 0;

  constructor(private authService: AuthService, ) { }

  ngOnInit(): void {
    // this.loadNotifications();
    // this.isLoggedIn(this.authService)
  }
 // Méthode pour vérifier si l'utilisateur est connecté
 isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}

  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }
}
