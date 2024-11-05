import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import Swal from 'sweetalert2';  // Import SweetAlert
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, throwError } from 'rxjs';
import { ConducteurService } from '../../../services/conducteur.service';
import { TrajetService } from '../../../services/tajet.service';
import { Trajet } from '../../../Models/trajet/trajet.component';
// import { Header-conducteurComponent } from '../../header/header.component';
import { HeaderComponent } from '../../header-conducteur/header-conducteur.component';
@Component({
  selector: 'app-historique-trajet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ,HeaderComponent],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueTrajetComponent implements OnInit {
  trajets: Trajet[] = []; // Initialize as an empty array for storing multiple trajets
  trajetForm: FormGroup;
  searchTerm: string = '';  // Variable pour les recherches
  trajetsToday: Trajet[] = []; // tableau pour les trajets du jour
  upcomingTrajets: Trajet[] = []; // tableau pour les trajets à venir
  conducteur: any; // Conducteur connecté
  sortKey: string = '';  // Property to hold the current sort key
  sortDirection: string = 'asc';  // Property to hold the sorting direction
  filteredTrajets: Trajet[] = []; // Array to hold sorted/filter trajectories

  constructor(
    private trajetService: TrajetService,
    private fb: FormBuilder,
    private conducteurService: ConducteurService,
    private router: Router
  ) {
    // Initializing the form group with controls and validation
    this.trajetForm = this.fb.group({
      point_depart: ['', Validators.required],
      point_arrivee: ['', Validators.required],
      date_depart: ['', Validators.required], // Separate field for departure date
      heure_depart: ['', Validators.required], // Separate field for departure time
      conducteur_id: [null, Validators.required],
      vehicule_id: [null, Validators.required],
      statut: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      nombre_places: [1, [Validators.required, Validators.min(1)]], // Field for number of places
    });
  }

  ngOnInit(): void {
    this.fetchTrajets(); // Load trajets on component initialization
  }
  fetchTrajets(): void {
    this.conducteurService.getConducteurByUserId().pipe(
      switchMap((response: any) => {
        console.log('Réponse Conducteur:', response);
        if (response.data && response.data.length > 0) {
          this.conducteur = response.data[0];
          console.log('Conducteur:', this.conducteur);
          return this.trajetService.getTrajetByConducteurId(this.conducteur.id);
        } else {
          throw new Error('Aucun conducteur trouvé');
        }
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Réponse Trajets:', response);
        if (response.data && Array.isArray(response.data)) {
          this.trajets = response.data;
        } else {
          console.error('Données de trajet inattendues:', response);
        }
        console.log('Historique des trajets:', this.trajets);
        this.filterTrajets();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des trajets ou du conducteur', err);
      }
    });
  }

  // fetchTrajets(): void {
  //   this.conducteurService.getConducteurByUserId().pipe(
  //     switchMap((response: any) => {
  //       if (response.data && response.data.length > 0) {
  //         this.conducteur = response.data[0];
  //         console.log('Conducteur:', this.conducteur);
  //         return this.trajetService.getTrajetByConducteurId(this.conducteur.id);
  //       } else {
  //         throw new Error('Aucun conducteur trouvé');
  //       }
  //     })
  //   ).subscribe({
  //     next: (response: any) => {
  //       if (response.data && Array.isArray(response.data)) {
  //         this.trajets = response.data; // Accéder au tableau dans 'data'
  //       } else {
  //         console.error('Données de trajet inattendues:', response);
  //       }
  //       console.log('Historique des trajets:', this.trajets);
  //       this.filterTrajets(); // Appel de filtrage après récupération des trajets
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors de la récupération des trajets ou du conducteur', err);
  //     }
  //   });
  // }

  // Method to filter trajets based on search term
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

    this.filterTrajets(); // Mise à jour des trajets du jour et à venir après le filtrage
  }

  // Filter trajets into today's and upcoming
  filterTrajets(): void {
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date with time set to midnight

    this.trajetsToday = this.trajets.filter((trajet) => {
      const trajetDate = new Date(trajet.date_depart).setHours(0, 0, 0, 0); // Format the date_depart field
      return trajetDate === today; // Check if the trip is today
    });

    this.upcomingTrajets = this.trajets.filter((trajet) => {
      const trajetDate = new Date(trajet.date_depart).setHours(0, 0, 0, 0);
      return trajetDate > today; // Check if the trip is in the future
    });
  }

  // Sort the trajets based on the provided key
  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Toggle sort direction
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc'; // Default to ascending
    }

    this.filteredTrajets = this.filteredTrajets.sort((a, b) => {
      let compareA = a[key as keyof Trajet];
      let compareB = b[key as keyof Trajet];

      // If values are numbers, we can directly compare
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return this.sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
      }

      // Otherwise, we convert to lowercase for string comparison
      compareA = (compareA as string).toLowerCase();
      compareB = (compareB as string).toLowerCase();

      return this.sortDirection === 'asc'
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    });
  }

  // Reset the filters to show all trajets
  resetFilters(): void {
    this.filteredTrajets = this.trajets; // Reset to original list
    this.searchTerm = ''; // Clear search term
    this.sortKey = ''; // Reset sort key
    this.sortDirection = 'asc'; // Reset sort direction
  }
  // Ajout de la méthode de confirmation du trajet
confirmTrajet(trajetId: number): void {
  // Utilisation de SweetAlert pour demander la confirmation
  Swal.fire({
    title: 'Confirmer le trajet',
    text: 'Êtes-vous sûr de vouloir confirmer ce trajet ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      // Appel au service pour confirmer le trajet
      this.trajetService.confirmTrajet(trajetId).subscribe(

         (response: any) => {
          console.log('Trajet confirmé avec succès:', response);
          this.fetchTrajets(); // Rafraîchit la liste des trajets après confirmation


          console.log(trajetId,'id du trajet est bien recuperer');
          Swal.fire(
            'Trajet confirmé!',
            'Le trajet a été confirmé avec succès.',
            'success'
          );
          this.fetchTrajets(); // Rafraîchit la liste des trajets après confirmation
        },
        (error) => {
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la confirmation du trajet.',
            'error'
          );
          console.error('Error confirming trajet:', error);
        }
      );
    }
  });
}



  // Method to handle form submission
  onSubmit(): void {
    if (this.trajetForm.valid) {
      this.trajetService.addTrajets(this.trajetForm.value).subscribe(
        (response) => {
          console.log('Trajet added successfully', response);
          this.fetchTrajets(); // Reload the list after a successful addition
          this.trajetForm.reset(); // Reset the form after submission
        },
        (error) => {
          console.error('Error adding trajet:', error);
        }
      );
    }
  }

  // Method to navigate to the edit page
  navigateToEdit(trajetId: number): void {
    this.router.navigate(['/modifier', trajetId]);  // Adjust the route as needed
  }

  // Method to navigate to the detail page
  navigateToDetail(trajetId: number): void {
    this.router.navigate(['/trajet/conducteur', trajetId]);
  }

  // Method to delete a trajet
  deleteTrajet(trajetId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cette action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trajetService.deleteTrajets(trajetId).subscribe(
          () => {
            Swal.fire(
              'Supprimé!',
              'Le trajet a été supprimé.',
              'success'
            );
            this.fetchTrajets();  // Refresh the list of trajets
          },
          (error) => {
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la suppression du trajet.',
              'error'
            );
            console.error('Error deleting trajet:', error);
          }
        );
      }
    });
  }

  // Handle any HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }


}