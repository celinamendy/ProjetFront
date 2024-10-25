// import { Component } from '@angular/core';


// export class ModifierComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrajetService } from '../../../services/tajet.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { Trajet } from '../../../Models/trajet/trajet.component';

@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.css'
})
export class ModificationTrajetComponent implements OnInit {

  trajetForm: FormGroup;
  trajetId!: number;
  trajet: any;
  // imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private trajetService: TrajetService,
    private router: Router,
    private route: ActivatedRoute

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
        const date = trajet.data.date_depart ? new Date(trajet.data.date_depart).toISOString().substring(0, 10) : '';
        this.trajet = trajet.data;

        this.trajetForm.patchValue({
          point_depart: this.trajet.point_depart,
          point_arrivee: this.trajet.point_arrivee,
          date_depart: date,
          heure_depart: this.trajet.heure_depart,
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
    if (this.trajetForm.valid) {
      const formData = new FormData();

      Object.keys(this.trajetForm.controls).forEach(key => {
        const control = this.trajetForm.get(key);
        if (control && control.value) {
          formData.append(key, control.value);
        }
      });

      this.trajetService.updateTrajets(this.trajetId, formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Trajet mis à jour',
            text: 'Le trajet a été mis à jour avec succès!',
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            this.router.navigate(['/historique']); // Redirection après la mise à jour
          }, 2000);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de mise à jour',
            text: 'Une erreur s\'est produite lors de la mise à jour du trajet.',
            showConfirmButton: true
          });
        }
      });
    }
  }
}
