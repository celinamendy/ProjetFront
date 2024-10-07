import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TrajetService } from '../../../services/tajet.service';
import { AuthService } from '../../../services/Auth/auth.service';
import { VehiculeService } from '../../../services/vehicule.service';
import { Vehicule } from '../../../Models/vehicule/vehicule.component';
import { ConducteurService } from '../../../services/conducteur.service'; // Ajout du service conducteur

@Component({
  selector: 'app-ajout-trajet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.html']
})
export class AjouterTrajetComponent implements OnInit {
  trajetForm: FormGroup;
  userVehiculeId: number | null = null; // Variable pour stocker l'ID du véhicule de l'utilisateur connecté
  vehicules: Vehicule[] = []; // Correction du nom du tableau et du type
  conducteur: any; // Modification: Conducteur sera un objet unique
  vehiculesConducteur: any[] = []; // Correction du nom du tableau et du type

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private trajetService: TrajetService,
    private vehiculeService: VehiculeService,
    private authService: AuthService, // Injection du AuthService
    private conducteurService: ConducteurService
  ) {
    // Initialisation du formulaire avec les champs nécessaires
 // Dans le constructeur, ajouter Validators pour chaque champ requis
 this.trajetForm = this.formBuilder.group({
  conducteur_id: [null, Validators.required], // Assurez-vous qu'il est requis
  point_depart: ['', [Validators.required, Validators.minLength(3)]],
  point_arrivee: ['', [Validators.required, Validators.minLength(3)]],
  date_depart: ['', Validators.required], // Assurez-vous que ce contrôle existe
  heure_depart: ['', Validators.required], // Assurez-vous que ce contrôle existe
  nombre_places: [null, [Validators.required, Validators.min(1)]],
  prix: [null, [Validators.required, Validators.min(0)]],
  statut: ['disponible', Validators.required],
  vehicule_id: ['', Validators.required]
});


  }

  ngOnInit(): void {
    this.loadUserData(); // Charger les données depuis le localStorage ou via API
  }

  loadUserData() {
    const storedConducteur = localStorage.getItem('conducteur');
    const storedVehicules = localStorage.getItem('vehicules');

    if (storedConducteur && storedVehicules) {
      this.conducteur = JSON.parse(storedConducteur);
      this.vehicules = JSON.parse(storedVehicules);
      console.log('Données chargées depuis localStorage', { conducteur: this.conducteur, vehicules: this.vehicules });

      // Pré-remplir le champ `vehicule_id` du formulaire si applicable
      if (this.vehicules.length > 0) {
        this.trajetForm.patchValue({ vehicule_id: this.vehicules[0].id });
      }
    } else {
      this.getUser();
      this.getConducteurByUserId(); // Récupérer les données s'il n'y a rien dans le localStorage
    }
  }

  getUser() {
    const user = this.authService.getUser();
    if (user) {
      console.log('Utilisateur connecté:', user);
      if (user.conducteur && user.conducteur.vehicule) {
        this.userVehiculeId = user.conducteur.vehicule.id;
        this.trajetForm.patchValue({ vehicule_id: this.userVehiculeId });
      } else {
        console.warn('Utilisateur non conducteur ou sans véhicule associé');
      }
    } else {
      console.warn('Aucun utilisateur trouvé');
    }
  }

  // Récupération des véhicules disponibles
  getVehiculeByConducteurConnected(idConducteur: any) {
    this.vehiculeService.getAllVehiculesByUserConnected(idConducteur).subscribe(
      (response) => {
        this.vehicules = response.data;
        localStorage.setItem('vehicules', JSON.stringify(this.vehicules));
        console.log('Véhicules récupérés:', this.vehicules);
      },
      error => {
        console.error('Erreur lors de la récupération des véhicules du conducteur', error);
      }
    );
  }

  // Récupération du conducteur par ID utilisateur
  getConducteurByUserId() {
    this.conducteurService.getConducteurByUserId().subscribe(
      (response) => {
        this.conducteur = response.data[0];
        localStorage.setItem('conducteur', JSON.stringify(this.conducteur));
        this.getVehiculeByConducteurConnected(this.conducteur.id);
        console.log('Conducteur récupéré:', this.conducteur);
      },
      error => {
        console.error('Erreur lors de la récupération du conducteur', error);
      }
    );
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.trajetForm.valid) {
      const formData = this.trajetForm.value;
      formData.conducteur_id = this.authService.getUserId(); // Assurez-vous que cette méthode est disponible dans AuthService
      console.log('conducteur_id:', this.authService.getUserId());
      console.log('Formulaire envoyé avec les données:', formData);

      this.trajetService.addTrajets(formData).subscribe({
        next: (response) => {
          console.log('Trajet ajouté avec succès:', response);
          Swal.fire({
            icon: 'success',
            title: 'Trajet ajouté',
            text: 'Le trajet a été ajouté avec succès.',
            showConfirmButton: false,
            timer: 2000
          });

          setTimeout(() => {
            this.router.navigate(['/trajets']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du trajet:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de l\'ajout du trajet.',
            showConfirmButton: true
          });
        }
      });
    } else {
      console.warn('Formulaire non valide.');// Arrêtez l'exécution si le formulaire est invalide
    }
  }

  // Gestion du changement de fichier
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trajetForm.patchValue({
        photo: file
      });
    }
  }
}
