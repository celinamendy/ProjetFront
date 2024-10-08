import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrajetService } from '../../services/tajet.service';
import { Trajet } from '../../Models/trajet/trajet.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import Swal from 'sweetalert2';  // Import SweetAlert
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-trajet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],  
  templateUrl: './trajet.component.html',
  styleUrls: ['./trajet.component.css']
})
export class TrajetComponent implements OnInit {

  trajets: Trajet[] = []; // Initialize as an empty array for storing multiple trajets
  trajetForm: FormGroup;
  searchTerm: string = '';  // Variable pour les recherches
  trajetsToday: Trajet[] = []; // tableau pour les trajets du jour
  upcomingTrajets: Trajet[] = []; // tableau pour les trajets a venir


  constructor(
    private trajetService: TrajetService,
    private fb: FormBuilder,
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

  // Method to fetch all trajets from the service
  fetchTrajets(): void {
    this.trajetService.getAllTrajets().subscribe({
      next: (data) => {
        this.trajets = data.data;
        console.log('Trajets loaded successfully:', this.trajets);
      },
      error: (error) => {
        console.error('Error fetching trajets:', error);
        this.handleError(error);
      }
    });
  }

  // Method to filter trajets based on search term
  applyFilter(): void {
    if (this.searchTerm) {
      this.trajets = this.trajets.filter((trajet) =>
        trajet.point_depart.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.point_arrivee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.prix.toString().includes(this.searchTerm)
      );
    } else {
      this.fetchTrajets(); // Reload all trajets if search term is cleared
    }
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
    this.router.navigate(['/trajet/edit', trajetId]);  // Adjust the route as needed
  }

  // Method to navigate to the detail page
  navigateToDetail(trajetId: number): void {
    this.router.navigate(['/trajet', trajetId]);
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
