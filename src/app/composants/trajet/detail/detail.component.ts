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
import { imageUrl } from '../../../services/image';
import { VehiculeService } from '../../../services/vehicule.service';
import { log } from 'console';
registerLocaleData(localeFR, 'fr');
import { HeaderComponent } from '../../header-passager/header-passager.component';

export enum Note {
  Pour = 'pour',
  Contre = 'contre'
}

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule, HeaderComponent ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailTrajetComponent implements OnInit {
  public Note = Note; // Ajoutez ceci pour exposer l'énumération

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
  likesCount: number = 0;
  dislikesCount: number = 0;
  // pourCount: number = 0; // Déclaration de la propriété pourCount
  // contreCount: number = 0; // Déclaration de la propriété contreCount
  avis: any[] = [];
  notifications: any[] = []; // Tableau pour stocker les notifications
  notificationCount: number = 0; // Compteur de notifications
avisItem: any;
newNote: Note | '' = ''; // Valeur vide par défaut, soit 'pour', soit 'contre'
  comment: any[] = [];
  userNote: Note | null = null;
  vehicules: any[] = [];   // Liste des véhicules du conducteur
  imageUrl: string = imageUrl;
  vehiculeService: any;

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
    this.checkUserNote(); //

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
  checkUserNote(): void {
    const userId = this.getUserId();
    const userNoteAvis = this.avis.find((avis) => avis.user_id === userId);
    this.userNote = userNoteAvis ? userNoteAvis.note : null;
  }

  // Méthode pour définir la note
  setNote(note: string): void {
    // if (note === 1) {
    //   this.likesCount++;
    //   this.newNote = '';
    // } else if (note === -1) {
    //   this.dislikesCount++;
    //   this.newNote = '';
    // }




    const avisData = new FormData();
    avisData.append('note', note);

    // Appel API pour enregistrer la note
    this.reservationService.addAvis(avisData).subscribe(
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
      // Vérifiez si 'data' est défini avant d'accéder à ses propriétés
      if (this.trajet.data) {
        this.isAvailable = this.trajet.statut?.trim().toLowerCase() === 'disponible';
        this.passager = this.trajet.data.reservations;
        this.avis = this.trajet.data.avis || [];
        this.comment = this.avis.filter((avis) => avis.commentaire);
        this.likesCount = this.avis.filter((avis) => avis.note === Note.Pour).length;
        this.dislikesCount = this.avis.filter((avis) => avis.note === Note.Contre).length;
        this.vehicules = this.trajet.data.conducteur.vehicules || [];


        const placesDisponibles = this.trajet.data.nombre_places;
        const nombreReservations = this.trajet.data.reservations.length;
        const placesRestantes = placesDisponibles - nombreReservations;
        this.trajet.data.placesRestantes = placesRestantes;
        console.log(this.trajet.data);

      } else {
        console.error('La propriété data est manquante dans la réponse du trajet');
      }
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

         // Vérifier et mettre à jour le statut du trajet
        if (nombreReservations + 1 >= placesDisponibles) {
          const trajetData = new FormData();
          trajetData.append('statut', 'terminer');

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

// Méthode pour définir la note et ajouter un avis
setRating(note: Note): void {
  this.newNote = note; // Définir la note sélectionnée
  if (this.userNote === note) {
    console.log(`L'utilisateur a déjà ${note === Note.Pour ? 'liké' : 'disliké'} ce trajet.`);
    return; // Ne rien faire si l'utilisateur a déjà voté de cette manière
  }

  this.addComment(); // Appeler la méthode pour ajouter l'avis directement
}


// Méthode pour ajouter un commentaire ou une note
addComment(): void {
  if (!this.newComment && !this.newNote) {
    console.error('Veuillez entrer un commentaire ou une note');
    return;
  }

  const avisData = new FormData();
  avisData.append('user_id', this.UserId!.toString());
  avisData.append('trajet_id', this.trajetId);

  if (this.newComment.trim()) {
    avisData.append('commentaire', this.newComment);
  }

  if (this.newNote) {
    avisData.append('note', this.newNote);
  }

  this.reservationService.addAvis(avisData).subscribe(
    (response) => {
      console.log('Commentaire ajouté avec succès:', response);
      this.trajet.data.avis.push(response.data);
      window.location.reload();

      // this.updateCounts(); // Mettre à jour les compteurs après l'ajout
      this.newComment = '';
      this.newNote = '';
    },

    (error) => {
      console.error("Erreur lors de l'ajout du commentaire:", error);
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
