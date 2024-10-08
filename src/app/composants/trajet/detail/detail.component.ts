import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFR from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

registerLocaleData(localeFR, 'fr');

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailTrajetComponent implements OnInit {
  trajetId!: string; // ID du trajet à récupérer
  trajet: any = {}; // Initialisez trajet à un objet vide
  isAvailable: boolean = false; // Propriété pour gérer l'état de disponibilité
  newComment: string = ''; // Pour stocker le commentaire nouvellement ajouté
  loading: boolean = true; // État de chargement
  trajetsConducteur: any[] = []; // Propriété pour stocker les trajets du conducteur
  UserId: number | null = null; // Déclarez la propriété UserId

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!; // Récupération de l'ID du trajet depuis l'URL
        this.UserId = this.getUserId(); // Récupérez l'ID de l'utilisateur connecté
    this.loadDetails(); // Chargement des détails du trajet
  }
  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }
  loadDetails(): void {
    this.loading = true; // Définissez loading sur true avant de récupérer
    this.trajetService.getTrajetsDetails(+this.trajetId).subscribe(
      (data: any) => {
        this.trajet = {
          ...data,
          comments: data.comments || [] // Assurez-vous que la propriété comments est initialisée
        };
        this.isAvailable = this.trajet.statut?.trim().toLowerCase() === 'disponible'; // Vérifiez si le trajet est disponible
        console.log('Détails du trajet:', this.trajet.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trajet:', error);
        this.trajet = {}; // Réinitialisez trajet en cas d'erreur
      }
    ).add(() => {
      this.loading = false; // Définissez loading sur false après récupération
    });
  }

  goBack(): void {
    this.location.back(); // Fonction pour revenir à la page précédente
  }
    // Nouvelle méthode pour charger les trajets par ID du conducteur
  loadTrajetsByConducteur(conducteurId: number): void {
    this.trajetService.getTrajetByConducteurId(conducteurId).subscribe(
      (data: any) => {
        this.trajetsConducteur = data.data; // Stockez les trajets du conducteur
        console.log('Trajets du conducteur:', this.trajetsConducteur);
      },
      (error) => {
        console.error('Erreur lors de la récupération des trajets du conducteur:', error);
      }
    );
  }
  // reserveTrajet(): void {
  //   if (this.trajet && this.isAvailable) {
  //     // Ajoutez votre logique pour réserver le trajet ici
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Trajet Réservé',
  //       text: 'Votre réservation a été confirmée.',
  //       timer: 3000,
  //       showConfirmButton: false
  //     });
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Erreur de réservation',
  //       text: 'Ce trajet n\'est pas disponible pour le moment.',
  //       showConfirmButton: true
  //     });
  //   }
  // }
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

    this.trajetService.addreserveTrajet(reservationData).subscribe( // Correction de l'appel au service
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

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' '); // Format YYYY-MM-DD HH:MM:SS
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

  addComment(): void {
    if (this.newComment.trim()) {
      const comment = {
        nom: 'Utilisateur',
        message: this.newComment,
        date: new Date()
      };
      this.trajet.comments.push(comment); // Ajoutez le commentaire à la liste
      this.newComment = ''; // Réinitialisez le champ de commentaire
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un commentaire valide.',
        showConfirmButton: true
      });
    }
  }
}
