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
import { NotificationsService } from '../../services/notifications.service'; // Assurez-vous que le chemin est correct
import { AuthService } from '../../services/Auth/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-trajet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , HeaderComponent ],
  templateUrl: './trajet.component.html',
  styleUrls: ['./trajet.component.css']
})
export class TrajetComponent implements OnInit {

  trajets: Trajet[] = []; // Initialize as an empty array for storing multiple trajets
  trajetForm: FormGroup;
  searchTerm: string = '';  // Variable for search functionality
  trajetsToday: Trajet[] = []; // Array for today's trips
  upcomingTrajets: Trajet[] = []; // Array for upcoming trips
  sortKey: string = '';  // Property to hold the current sort key
  sortDirection: string = 'asc';  // Property to hold the sorting direction
  filteredTrajets: Trajet[] = []; // Array to hold sorted/filter trajectories
  notifications: any[] = [];
  notificationCount: number = 0;
  constructor(
    private trajetService: TrajetService,
    private fb: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private authService: AuthService
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

  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }

  // Method to fetch all trajets from the service
  fetchTrajets(): void {
    this.trajetService.getAllTrajets().subscribe({
      next: (data) => {
        this.trajets = data.data;
        this.filteredTrajets = this.trajets; // Initialize filteredTrajets
        this.filterTrajets(); // Filter trips for today and upcoming
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
      this.filteredTrajets = this.trajets.filter((trajet) =>
        trajet.point_depart.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.point_arrivee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trajet.prix.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredTrajets = this.trajets; // Reset to original list if search term is cleared
    }
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
          this.handleError(error); // Handle the error properly
        }
      );
    } else {
      Swal.fire('Error', 'Please fill in all required fields.', 'error'); // Show error if form is invalid
    }
  }

  // Method to navigate to the detail page
  navigateToDetail(trajetId: number): void {
    this.router.navigate(['/trajet', trajetId]);
  }

  // Method to delete a trajet
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
          (response) => { // Handle success response
            Swal.fire('Supprimé!', 'Le trajet a été supprimé.', 'success');
            this.fetchTrajets();  // Refresh the list of trajets
          },
          (error) => { // Handle error response
            this.handleError(error);
          }
        );
      }
    });
  }

  // Handle any HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    Swal.fire('Erreur', 'Une erreur est survenue, veuillez réessayer plus tard.', 'error'); // Display error alert
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
