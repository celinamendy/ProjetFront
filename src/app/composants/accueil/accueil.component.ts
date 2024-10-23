import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { NotificationsService } from '../../services/notifications.service'; // Assurez-vous que le chemin est correct
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    HeaderComponent, // Assurez-vous que le composant HeaderComponent est correctement importé
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
  }

  // // Méthode pour charger les notifications
  // loadNotifications() {
  //   this.notificationsService.getNotifications().subscribe(
  //     (data) => {
  //       this.notifications = data; // Adaptez cela selon la structure de votre réponse
  //       this.notificationCount = this.notifications.length; // Comptez le nombre de notifications
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des notifications', error);
  //     }
  //   );
  // }
  // private notificationsService: NotificationsService
  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }
}
