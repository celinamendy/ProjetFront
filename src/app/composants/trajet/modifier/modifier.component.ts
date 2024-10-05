// import { Component } from '@angular/core';


// export class ModifierComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrajetService } from '../../../services/tajet.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.css'
})
export class ModificationTrajetComponent implements OnInit {
  trajetForm: FormGroup;
  trajetId!: number;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private trajetService: TrajetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trajetForm = this.fb.group({
      depart: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      places: ['', Validators.required],
      prix: ['', Validators.required],
      photo: [null]
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
      (trajet: any)=> {
        const date = trajet.date ? new Date(trajet.date).toISOString().substring(0, 10) : '';

        this.trajetForm.patchValue({
          depart: trajet.depart,
          destination: trajet.destination,
          date: date,
          heure: trajet.heure,
          places: trajet.places,
          prix: trajet.prix
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération du trajet:', error.message);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
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

      if (this.imageFile) {
        formData.append('photo', this.imageFile);
      }

      if (this.trajetId) {
        formData.append('id', this.trajetId.toString());
      }

      this.trajetService.updateTrajets(this.trajetId,formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Trajet mis à jour',
            text: 'Le trajet a été mis à jour avec succès!',
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            this.router.navigate(['/trajet']); // Redirection après la mise à jour
          }, 2000);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour du trajet.',
            showConfirmButton: false,
            timer: 3000
          });
        }
      });
    }
  }
}
