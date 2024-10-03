// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-ajouter',
//   standalone: true,
//   imports: [],
//   templateUrl: './ajouter.component.html',
//   styleUrl: './ajouter.component.css'
// })
// export class AjouterComponent {

// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TrajetService } from '../../../services/tajet.service';

@Component({
  selector: 'app-ajout-trajet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.html',]
})
export class AjouterTrajetComponent {
  trajetForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private trajetService: TrajetService
  ) {
      this.trajetForm = this.formBuilder.group({
        depart: ['', Validators.required],
        destination: ['', Validators.required],
        date: ['', Validators.required],
        places: ['', Validators.required],
        prix: ['', Validators.required],
        photo: [null],
        heure: ['', Validators.required]
      });
    }

    onSubmit() {
      if (this.trajetForm.valid) {
        const formData = new FormData();

        // Ajout des données du formulaire au FormData
        formData.append('depart', this.trajetForm.get('depart')?.value);
        formData.append('destination', this.trajetForm.get('destination')?.value);
        formData.append('date', this.trajetForm.get('date')?.value);
        formData.append('places', this.trajetForm.get('places')?.value);
        formData.append('prix', this.trajetForm.get('prix')?.value);
        formData.append('heure', this.trajetForm.get('heure')?.value);

        // Ajout du fichier photo s'il existe
        const file = this.trajetForm.get('photo')?.value;
        if (file) {
          formData.append('photo', file, file.name);
        }

        // Appel du service pour envoyer les données
        this.trajetService.addTrajets(formData).subscribe({
          next: (response) => {
            // Afficher l'alerte de succès
            Swal.fire({
              icon: 'success',
              title: 'Trajet ajouté',
              text: 'Le trajet a été ajouté avec succès!',
              showConfirmButton: false,
              timer: 2000
            });

            // Redirection après succès
            setTimeout(() => {
              this.router.navigate(['/trajets']);
            }, 2000);
          },
          error: (error) => {
            // Afficher l'alerte d'erreur
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de l\'ajout du trajet.',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    }

    // Gérer le changement de fichier
    onFileChange(event: any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.trajetForm.patchValue({
          photo: file
        });
      }
    }
  }
