import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrajetService } from '../../../services/tajet.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.css'] // Changed from styleUrl to styleUrls
})
export class ModificationTrajetComponent implements OnInit {
  trajetForm: FormGroup;
  trajetId!: number;
  trajet: any;

  constructor(
    private fb: FormBuilder,
    private trajetService: TrajetService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef here
  ) {
    this.trajetForm = this.fb.group({
      point_depart: ['', Validators.required],
      point_arrivee: ['', Validators.required],
      date_depart: ['', Validators.required],
      heure_depart: ['', Validators.required],
      nombre_places: ['', Validators.required],
      prix: ['', Validators.required],
      statut: ['', Validators.required],
      conducteur_id: ['', Validators.required],
      vehicule_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.trajetId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.trajetId) {
      this.loadTrajet();
    }
  }
  loadTrajet(): void {
    this.trajetService.getTrajetsDetails(this.trajetId).subscribe(
      (trajet: any) => {
        const date = trajet.data.date_depart
          ? new Date(trajet.data.date_depart).toISOString().substring(0, 10)
          : '';

        // Extraire uniquement les heures et minutes pour `heure_depart`
        const heureDepart = trajet.data.heure_depart
          ? trajet.data.heure_depart.substring(0, 5)  // Assurez-vous que `heure_depart` est au format `HH:mm:ss`
          : '';

        this.trajet = trajet.data;

        this.trajetForm.patchValue({
          point_depart: this.trajet.point_depart,
          point_arrivee: this.trajet.point_arrivee,
          date_depart: date,
          heure_depart: heureDepart,  // Appliquer l'heure au format `HH:mm`
          nombre_places: this.trajet.nombre_places,
          prix: this.trajet.prix,
          statut: this.trajet.statut,
          conducteur_id: this.trajet.conducteur_id,
          vehicule_id: this.trajet.vehicule_id,
        });
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de chargement',
          text: 'Impossible de charger les détails du trajet. Veuillez réessayer plus tard.',
          showConfirmButton: true
        });
      }
    );
  }

  onSubmit(): void {

    // Vérifie si le formulaire est valide
    if (this.trajetForm.valid) {

      const formData = this.trajetForm.value;


      // Appel du service pour mettre à jour le trajet
      this.trajetService.updateTrajets(this.trajetId, formData).subscribe({
        next: (response) => {
          this.trajet = response.data; // Mettez à jour l'état local

          // Affichage de la notification de succès
          Swal.fire({
            icon: 'success',
            title: 'Trajet mis à jour',
            text: 'Le trajet a été mis à jour avec succès!',
            showConfirmButton: false,
            timer: 2000
          });

          // Redirection après la mise à jour
          setTimeout(() => {
            this.router.navigate(['/historique']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error); // Log de l'erreur
          Swal.fire({
            icon: 'error',
            title: 'Erreur de mise à jour',
            text: error.error?.message || 'Une erreur s\'est produite lors de la mise à jour du trajet.',
            showConfirmButton: true
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Erreur de validation',
        text: 'Veuillez remplir tous les champs obligatoires.',
        showConfirmButton: true
      });
    }
  }

}
