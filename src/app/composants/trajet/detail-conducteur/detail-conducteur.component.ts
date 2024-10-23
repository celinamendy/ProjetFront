import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../../../services/reservation/reservation.component';
@Component({
  selector: 'app-detail-trajet-conducteur',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './detail-conducteur.component.html',
  styleUrls: ['./detail-conducteur.component.css']
})
export class DetailTrajetConducteurComponent implements OnInit {
  trajetId!: string;
  trajet: any = {};
  UserId: any | null = null;
  reservations: any[] = [];
  avis: any[] = []; // Déclaration de la propriété 'avis'
  loading: boolean = true;
  newComment: string = '';
  newNote: number = 5;



  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location,
    private reservationService: ReservationService,
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID du trajet via la route
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    // Récupération de l'ID de l'utilisateur
    this.UserId = this.getUserId();
    // Chargement des détails du trajet
    this.loadDetails();
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
          this.trajet = response.data; // Assurez-vous que vous accédez au bon champ
          console.log('detail',this.trajet); // Vérifiez la structure du trajet
          this.reservations = this.trajet.reservations || [];
          console.log('detail',this.reservations); // Vérifiez la structure du trajet

          this.avis = this.trajet.avis || [];
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
  addComment(): void {
    if (!this.newComment.trim()) {
      console.error('Le commentaire est vide');
      return;
    }

    const avisData = new FormData();
    avisData.append('user_id', this.UserId);
    avisData.append('trajet_id', this.trajetId);
    avisData.append('commentaire', this.newComment);
    avisData.append('note', this.newNote ? this.newNote.toString() : '5');

    this.reservationService.addAvis(avisData).subscribe(
      (response) => {
        console.log('Commentaire ajouté avec succès:', response);
        this.trajet.data.avis.push(response.data);
        this.newComment = '';
        this.newNote = 5;
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  // Affichage d'un message de succès
  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: message,
      timer: 3000,
      showConfirmButton: false
    });
  }

  // Affichage d'un message d'erreur
  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      showConfirmButton: true
    });
  }
}
