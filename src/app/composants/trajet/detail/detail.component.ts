import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFR from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../services/reservation/reservation.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/Auth/auth.service';
registerLocaleData(localeFR, 'fr');

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailTrajetComponent implements OnInit {
  trajetId!: string;
  trajet: any = {};
  isAvailable: boolean = false;
  newComment: string = '';
  loading: boolean = true;
  trajetsConducteur: any[] = [];
  UserId: number | null = null;
  reservations: any[] = [];
  passager: any[] = [];
  users: any[] = []; // Ajoutez un tableau pour stocker les utilisateurs

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location,
    private reservationService: ReservationService // Injection corrigée
  ) {}

  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    this.UserId = this.getUserId();
    this.loadDetails();
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  loadDetails(): void {
    this.loading = true;
    this.trajetService.getTrajetsDetails(+this.trajetId).subscribe(
      (data: any) => {
        this.trajet = {
          ...data,
        };
        this.isAvailable = this.trajet.statut?.trim().toLowerCase() === 'disponible';
        this.passager = this.trajet.data.reservations;
        console.log('Détails du trajet:', this.trajet.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trajet:', error);
        this.trajet = {};
      }
    ).add(() => {
      this.loading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }

  reserveTrajet(): void {
    if (!this.UserId || !this.trajet.id) {
      console.error('Données manquantes pour la réservation');
      return;
    }

    const reservationData = new FormData();
    reservationData.append('user_id', this.UserId.toString());
    reservationData.append('trajet_id', this.trajet.id.toString());
    reservationData.append('date_heure_reservation', this.formatDate(new Date()));
    reservationData.append('statut', 'Réservé');

    this.trajetService.addreserveTrajet(reservationData).subscribe(
      (response) => {
        console.log('Réservation réussie:', response);
        this.showSuccessMessage('Réservation effectuée avec succès.');
      },
      (error) => {
        console.error('Erreur lors de la réservation:', error);
        this.showErrorMessage('Une erreur est survenue lors de la réservation.');
      }
    );
  }

  addComment(): void {
    if (this.newComment.trim()) {
      const comment = {
        nom: 'Utilisateur',
        message: this.newComment,
        date: new Date()
      };
      this.trajet.comments.push(comment);
      this.newComment = '';
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un commentaire valide.',
        showConfirmButton: true
      });
    }
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: message,
      timer: 3000,
      showConfirmButton: false
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      showConfirmButton: true
    });
  }
}
