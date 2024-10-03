import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrajetService } from '../../services/tajet.service';
import { Trajet } from '../../Models/trajet/trajet.component';

@Component({
  selector: 'app-trajet',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './trajet.component.html',
  styleUrls: ['./trajet.component.css']
})
export class TrajetComponent implements OnInit {
  trajets: Trajet[] = [];
  trajetForm: FormGroup;

  constructor(private trajetService: TrajetService, private fb: FormBuilder) {
    this.trajetForm = this.fb.group({
      point_depart: ['', Validators.required],
      point_arrivee: ['', Validators.required],
      date_heure_depart: ['', Validators.required],
      conducteur_id: [null, Validators.required],
      statut: ['', Validators.required],
      vehicule_id: [null, Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.fetchTrajets();
  }

  fetchTrajets() {
    this.trajetService.getAllTrajets().subscribe(
      (response: any) => {
        this.trajets = response;
      },
      error => {
        console.error('Erreur lors de la récupération des trajets', error);
        // Afficher un message d'erreur à l'utilisateur si nécessaire
      }
    );
  }

  onSubmit() {
    if (this.trajetForm.valid) {
      this.trajetService.addTrajets(this.trajetForm.value).subscribe(
        (response) => {
          console.log('Trajet ajouté avec succès', response);
          this.fetchTrajets(); // Recharger la liste après l'ajout
          this.trajetForm.reset(); // Réinitialiser le formulaire
        },
        error => {
          console.error('Erreur lors de l\'ajout du trajet', error);
          // Afficher un message d'erreur à l'utilisateur si nécessaire
        }
      );
    }
  }
}
