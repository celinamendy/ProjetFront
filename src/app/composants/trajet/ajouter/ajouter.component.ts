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
    conducteur: any[] = []; // Correction du nom du tableau et du type
    vehiculesConducteur: any[] = []; // Correction du nom du tableau et du type

    constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private trajetService: TrajetService,
      private vehiculeService: VehiculeService,
      private authService: AuthService,// Injection du AuthService
      private conducteurService: ConducteurService //
    ) {
      // Initialisation du formulaire avec les champs nécessaires
      this.trajetForm = this.formBuilder.group({
        conducteur_id: ['', Validators.required] , // Add validators if needed
        point_depart: ['', Validators.required],
        point_arrivee: ['', Validators.required],
        date_depart: ['', Validators.required],
        heure_depart: ['', Validators.required],
        nombre_places: ['', Validators.required],
        prix: ['', Validators.required],
        statut: ['disponible', Validators.required],
        vehicule_id: ['', Validators.required] // Champ pour l'ID du véhicule
      });
    }

    ngOnInit(): void {
      this.getUser(); // Récupérer l'utilisateur connecté
      this.getVehicle(); // Récupérer les véhicules de l'utilisateur
      this.getConducteurByUserId()
    }

    // Récupération de l'utilisateur connecté
    // getUser() {
    //   this.authService.getUser().subscribe({
    //     next: (user: any) => {
    //       console.log('Utilisateur connecté:', user);

    //       // Vérifier si l'utilisateur a un rôle de conducteur et un véhicule associé
    //       if (user.conducteur && user.conducteur.vehicule) {
    //         this.userVehiculeId = user.conducteur.vehicule.id; // Récupérer l'ID du véhicule
    //         console.log('ID du véhicule récupéré:', this.userVehiculeId);

    //         // Pré-remplir le champ vehicule_id du formulaire si un véhicule est trouvé
    //         this.trajetForm.patchValue({ vehicule_id: this.userVehiculeId });
    //       } else {
    //         console.warn('L\'utilisateur n\'est pas un conducteur ou ne possède pas de véhicule.');
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Erreur lors de la récupération de l\'utilisateur connecté:', error);
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Erreur',
    //         text: 'Impossible de récupérer les informations de l\'utilisateur connecté.',
    //         showConfirmButton: true
    //       });
    //     }
    //   });
    // }

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
    getVehicle() {
      this.vehiculeService.getAllVehicules()
        .subscribe(
          (response) => {
            this.vehicules = response; // Correctly use 'Vehicule[]'
            console.log('Véhicules récupérés:', this.vehicules);
          },
          error => {
            console.error('Erreur lors de la récupération des trajets', error);
          }
        );
    }

    getVehiculeByConducteurConnected(idConducteur: any) {
      this.vehiculeService.getAllVehiculesByUserConnected(idConducteur)
        .subscribe(
          (response) => {
            this.vehicules = response.data;
            console.log('Véhicules récupérés:', this.vehicules);
          },
          error => {
            console.error('Erreur lors de la récupération des véhicules du conducteur', error);
          }
        );
    }

    getConducteurByUserId() {
      this.conducteurService.getConducteurByUserId()
        .subscribe(
          (response) => {
            this.conducteur = response.data[0].id;
            let datas = this.getVehiculeByConducteurConnected(this.conducteur)


            console.log('conducteur récupérés:', this.conducteur);
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

        // Ajoutez l'ID du conducteur à partir de l'utilisateur connecté
        formData.conducteur_id = this.authService.getUserId(); // Assurez-vous que cette méthode est disponible dans votre AuthService pour obtenir l'ID du conducteur

        console.log('Formulaire envoyé avec les données:', formData);

        // Appel du service pour ajouter le trajet
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

            // Redirection après succès
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
        console.warn('Formulaire non valide.');
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
