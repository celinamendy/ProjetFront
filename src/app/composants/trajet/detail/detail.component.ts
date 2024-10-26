import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFR from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../services/reservation/reservation.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/Auth/auth.service'; // Importer AuthService
import { Avis } from '../../../Models/avis/avis.component';
import { NotificationsService } from '../../../services/notifications.service';
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
  UserId: any | null = null;
  reservations: any[] = [];
  passager: any[] = [];
  users: any[] = []; // Tableau pour stocker les utilisateurs
  newNote: number = 0;
  likesCount: number = 0;
  dislikesCount: number = 0;
  avis: any[] = [];
  notifications: any[] = []; // Tableau pour stocker les notifications
  notificationCount: number = 0; // Compteur de notifications

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    this.UserId = this.getUserId();
    this.loadDetails();
    this.loadNotifications();
  }

  // Méthode pour charger les notifications
  loadNotifications() {
    this.notificationsService.getNotifications().subscribe(
      (data) => {
        this.notifications = data; // Adaptez cela selon la structure de votre réponse
        this.notificationCount = this.notifications.length; // Comptez le nombre de notifications
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    );
  }

  // Méthode pour définir la note
  setNote(note: number, avisId: number): void {
    if (note === 1) {
      this.likesCount++;
      this.newNote = 1;
    } else if (note === -1) {
      this.dislikesCount++;
      this.newNote = -1;
    }

    // Appel API pour enregistrer la note
    this.reservationService.updateNote(avisId, note).subscribe(
      (response) => {
        console.log('Note mise à jour:', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la note:', error);
      }
    );
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

        const placesDisponibles = this.trajet.data.nombre_places;
        const nombreReservations = this.trajet.data.reservations.length;
        const placesRestantes = placesDisponibles - nombreReservations;

        console.log(`Places restantes pour le trajet ${this.trajetId}:`, placesRestantes);
        this.trajet.data.placesRestantes = placesRestantes;

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

  reserveTrajet(trajetId: any): void {
    // Vérifier que les données sont bien disponibles
    if (!trajetId || !this.trajet) {
      console.error('Données manquantes pour la réservation', this.UserId, trajetId);
      return;
    }

    const placesDisponibles = this.trajet.data.nombre_places;
    const nombreReservations = this.trajet.data.reservations.length;

    // Vérifier la disponibilité des places
    if (nombreReservations < placesDisponibles) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const reservationData = new FormData();
      reservationData.append('user_id', this.UserId);
      reservationData.append('trajet_id', trajetId);
      reservationData.append('date_heure_reservation', formattedDate);
      reservationData.append('statut', 'confirmer');

      // Appel au service pour ajouter la réservation
      this.trajetService.addreserveTrajet(reservationData).subscribe(
        (response) => {
          console.log('Réservation réussie:', response);
          this.showSuccessMessage('Réservation effectuée avec succès.');

          // Envoi de notification après la réservation réussie
          this.notificationsService.sendNotification(
            'Nouvelle Réservation',
            `Vous avez réservé le trajet ${this.trajetId}.`,
            this.UserId
          ).subscribe(
            () => {
              console.log('Notification envoyée avec succès.');
            },
            (error) => {
              console.error('Erreur lors de l\'envoi de la notification:', error);
            }
          );

          // Recharger les notifications après réservation
          this.loadNotifications();

          const trajetData = new FormData();
          trajetData.append('statut', 'terminer');

          // Vérifier si le nombre de réservations atteint le nombre de places disponibles
          if (nombreReservations + 1 >= placesDisponibles) {
            // Mettre à jour le statut du trajet en "terminé"
            this.trajetService.updateTrajets(trajetId, trajetData).subscribe(
              (statusResponse) => {
                console.log('Statut du trajet mis à jour en terminé:', statusResponse);
              },
              (statusError) => {
                console.error("Erreur lors de la mise à jour du statut du trajet:", statusError);
              }
            );
          }
          window.location.reload();
        },
        (error) => {
          console.error('Erreur lors de la réservation:', error);
          this.showErrorMessage('Désolé, mais vous ne pouvez plus réserver ce trajet.');
        }
      );
    } else {
      console.error('Aucune place disponible pour cette réservation.');
      this.showErrorMessage('Désolé, le nombre de places disponibles pour ce trajet est atteint.');
    }
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      console.error('Le commentaire est vide');
      return;
    }

    const avisData = new FormData();
    avisData.append('user_id', this.UserId);
    avisData.append('trajet_id', this.trajetId);
    avisData.append('commentaire', this.newComment);

    // Utiliser la nouvelle note définie par like/dislike
    avisData.append('note', this.newNote ? this.newNote.toString() : '0'); // Note par défaut à 0 si pas de sélection

    this.reservationService.addAvis(avisData).subscribe(
      (response) => {
        console.log('Commentaire ajouté avec succès:', response);
        this.trajet.data.avis.push(response.data);
        this.newComment = '';
        this.newNote = 0; // Réinitialiser la note après ajout
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    );
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
