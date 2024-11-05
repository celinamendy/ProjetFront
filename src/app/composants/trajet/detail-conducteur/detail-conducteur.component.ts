import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../../../services/reservation/reservation.component';
import { HeaderComponent } from '../../header-conducteur/header-conducteur.component';
@Component({
  selector: 'app-detail-trajet-conducteur',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './detail-conducteur.component.html',
  styleUrls: ['./detail-conducteur.component.css']
})
export class DetailTrajetConducteurComponent implements OnInit {

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location,
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) {}

  trajetId!: string;
  trajet: any = {};
  UserId: number | null = null;
  reservations: any[] = [];
  avis: any[] = [];
  loading: boolean = true;
  newComment: string = '';
  newNote: number = 0;
  likesCount: number = 0;
  dislikesCount: number = 0;
  user: any = {};
  details!: any;
  datasRersvation: any[] = [];


  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    this.UserId = this.getUserId();
    this.loadDetails();
    this.loadConfirmedReservations();
  }

  getUserId(): number | null {
    const conducteur = localStorage.getItem('conducteur');
    return conducteur ? JSON.parse(conducteur).id : null;
  }

  loadDetails(): void {
    this.loading = true;
    this.trajetService.getTrajetsDetails(this.trajetId).subscribe(
      (response: any) => {
        if (response.status) {
          this.trajet = response.data;
          this.details = this.trajet.reservations || [];
          this.reservations = response.data.reservations || [];
          this.avis = this.trajet.avis || [];
          this.datasRersvation = [...this.reservations];
          
          // Appel de la fonction pour charger les réservations confirmées après les détails
          this.loadConfirmedReservations();
        } else {
          this.showErrorMessage(response.message);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trajet:', error);
        this.showErrorMessage('Erreur lors de la récupération des détails du trajet.');
      }
    ).add(() => {
      this.loading = false;
    });
  }

  loadConfirmedReservations(): void {
 // Parcourir les réservations déjà chargées dans datasRersvation
    this.datasRersvation.forEach(item => {
      if (item.statut === 'confirmer') {
        item.isSelected = true; // Pré-cocher les réservations confirmées
      } else {
        item.isSelected = false; // S'assurer que les réservations non confirmées ne sont pas cochées
      }
    });

    // Afficher l'état des réservations après traitement
    // console.log('Réservations après traitement pour confirmation:', this.datasRersvation);

    this.cdr.detectChanges(); // Déclencher la détection des changements
  }





  confirmSelectedReservations(): void {
    const selectedReservations = this.datasRersvation.filter(item => item.isSelected && !item.confirmed);

    if (selectedReservations.length > 0) {
      Swal.fire({
        title: 'Confirmer les réservations',
        text: `Êtes-vous sûr de vouloir confirmer ${selectedReservations.length} réservations?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, confirmer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.reservationService.confirmSelectedReservations(selectedReservations).subscribe(responses => {
            responses.forEach((response, index) => {
              if (response) {
                const reservation = selectedReservations[index];
                reservation.confirmed = true;
                this.showSuccessMessage(`Réservation pour ${reservation.user.prenom} confirmée avec succès!`);

              }
            });
          }, error => {
            console.error('Erreur lors de la confirmation des réservations:', error);
            this.showErrorMessage('Erreur lors de la confirmation des réservations.');
          });
        }
      });
    } else {
      this.showErrorMessage('Veuillez sélectionner au moins une réservation à confirmer.');
    }
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      console.error('Le commentaire est vide');
      return;
    }

    const avisData = new FormData();
    avisData.append('user_id', this.UserId!.toString());
    avisData.append('trajet_id', this.trajetId);
    avisData.append('commentaire', this.newComment);
    avisData.append('note', this.newNote ? this.newNote.toString() : '5');

    this.reservationService.addAvis(avisData).subscribe(
      (response) => {
        // console.log('Commentaire ajouté avec succès:', response);
        this.trajet.avis.push(response.data);
        this.newComment = '';
        this.newNote = 0;
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
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
