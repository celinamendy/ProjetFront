import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';  // Import SweetAlert
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Trajet } from '../../../Models/trajet/trajet.component';
import { ReservationService } from '../../../services/reservation/reservation.component';
import { PassagerService } from '../../../services/passager.service';
import { AuthService } from '../../../services/Auth/auth.service';
import { HeaderComponent } from '../../header-passager/header-passager.component';

@Component({
  selector: 'app-historique-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueReservationComponent implements OnInit {
  trajets: Trajet[] = []; // Trajets réservés par le passager
  reservationForm: FormGroup;
  searchTerm: string = '';  // Pour filtrer les trajets
  filteredTrajets: Trajet[] = []; // Trajets filtrés
  passager: any; // Passager connecté
  reservations: any[] = []; // Réservations du passager
  filteredReservations: any[] = []; // Réservations filtrées

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private passagerService: PassagerService,
    private authService: AuthService, // Injecter le service d'authentification
    private router: Router
  ) {
    this.reservationForm = this.fb.group({
      point_depart: ['', Validators.required],
      point_arrivee: ['', Validators.required],
      date_depart: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId(); // Utiliser le service d'auth pour obtenir l'ID utilisateur
    if (userId) {
      this.fetchReservations(userId); // Appeler fetchReservations avec l'ID utilisateur
    } else {
      console.error('Aucun utilisateur connecté');
    }
  }

  fetchReservations(userId: number): void {
    this.passagerService.getPassagerByUserId(userId).pipe(
      switchMap((response: any) => {
        console.log('Réponse Passager:', response);
        if (response.data) {
          this.passager = response.data; // Assigner l'objet passager directement
          console.log('Passager:', this.passager);

          // Vérifier si le passager a des réservations
          if (this.passager.user && Array.isArray(this.passager.user.reservations)) {
            this.reservations = this.passager.user.reservations.map((reservation: any) => {
              console.log('Réservation:', reservation); // Log des réservations
              return {
                id: reservation.id,
                trajet: reservation.trajet, // Extraire le trajet lié à la réservation
                date_depart: reservation.trajet.date_depart, // Exemple d'extraction des champs du trajet
                point_depart: reservation.trajet.point_depart,
                point_arrivee: reservation.trajet.point_arrivee,
                prix: reservation.trajet.prix
              };
            });
            console.log('Réservations mappées:', this.reservations);
          } else {
            console.error('Aucune réservation trouvée pour ce passager.');
          }

          // Appeler le service pour récupérer plus de détails si nécessaire
          return this.reservationService.getReservationsByPassagerId(this.passager.id);
        } else {
          throw new Error('Aucun passager trouvé');
        }
      }),
      catchError(this.handleError) // Gérer les erreurs
    ).subscribe({
      next: (response: any) => {
        console.log('Réponse du Service Réservations:', response);
        if (response.data && Array.isArray(response.data)) {
          // S'assurer que response.data contient les détails des trajets liés aux réservations
          this.trajets = response.data.map((reservation: any) => {
            return reservation.trajet; // Extraire le trajet de chaque réservation
          });
          console.log('Historique des trajets:', this.trajets);
          this.applyFilter(); // Appliquer le filtrage sur les trajets récupérés
        } else {
          console.error('Données inattendues:', response);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réservations ou du passager', err);
      }
    });
  }

  // Méthode pour filtrer les trajets
  applyFilter(): void {
    if (this.searchTerm) {
      this.filteredTrajets = this.trajets.filter((trajet) =>
        trajet.point_depart.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.point_arrivee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.prix.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredTrajets = [...this.trajets]; // Réaffecter la liste complète
    }
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
    this.filteredTrajets = this.trajets;
    this.searchTerm = ''; // Réinitialiser le champ de recherche
  }

  // Méthode pour trier les trajets selon un critère
  sortBy(criterion: string): void {
    if (criterion === 'date') {
      this.filteredTrajets.sort((a, b) => new Date(a.date_depart).getTime() - new Date(b.date_depart).getTime());
    } else if (criterion === 'destination') {
      this.filteredTrajets.sort((a, b) => a.point_arrivee.localeCompare(b.point_arrivee));
    } else if (criterion === 'early') {
      this.filteredTrajets.sort((a, b) => new Date(a.date_depart).getTime() - new Date(b.date_depart).getTime());
    } else if (criterion === 'cheap') {
      this.filteredTrajets.sort((a, b) => a.prix - b.prix);
    }
  }

  // Méthode pour naviguer vers le détail d'un trajet
  navigateToDetail(trajetId: number): void {
    this.router.navigate(['/trajet/passager', trajetId]);
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Une erreur est survenue. Veuillez réessayer plus tard.'));
  }
}

