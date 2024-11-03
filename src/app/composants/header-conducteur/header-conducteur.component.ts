import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { NotificationsService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'console';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header-conducteur.component.html',
  styleUrls: ['./header-conducteur.component.css']
})
export class HeaderComponent implements OnInit {
  hasNotifications: boolean = false;
  notifications: any[] = [];
  isModalOpen: boolean = false;
  notificationCount: number = 0;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.checkNotifications();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  checkNotifications() {
    this.notificationsService.getNotifications().subscribe(
      (response) => {
        this.notifications = response.données || [];
        this.notificationCount = this.notifications.length;  // Update notification count
        this.hasNotifications = this.notificationCount > 0;
        console.log('notifications', this.notifications);
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    );
  }


  showNotifications() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
