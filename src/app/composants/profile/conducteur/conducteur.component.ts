import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth/auth.service'; // Service d'authentification
import { VehiculeService } from '../../../services/vehicule.service';
import { NgFor, NgIf } from '@angular/common';
import { imageUrl } from '../../../services/image';
import { ConducteurService } from '../../../services/conducteur.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-conducteur',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './conducteur.component.html',
  styleUrls: ['./conducteur.component.css'] // Correction de "styleUrl" en "styleUrls"
})
export class ConducteurComponent implements OnInit {
  conducteurDetails: any;  // Détails du conducteur
  vehicules: any[] = [];   // Liste des véhicules du conducteur
  imageUrl: string = imageUrl;
  constructor(private authService: AuthService, private vehiculeService: VehiculeService,private conducteurService: ConducteurService) {}

  ngOnInit(): void {
    this.fetchConducteurDetails();  // Récupère les détails du conducteur à l'initialisation
  }

  // Méthode pour récupérer les détails du conducteur connecté
  fetchConducteurDetails(): void {
    this.authService.getUserDetails().subscribe(
      response => {
        this.conducteurDetails = response.data;  // Stocker les détails du conducteur
        console.log('Détails du conducteur:', this.conducteurDetails);
        console.log(this.conducteurDetails.conducteur.id);

        this.vehiculeService.getAllVehiculesByUserConnected(this.conducteurDetails.conducteur.id).subscribe(
          response => {
            console.log('Réponse API:', response);  // Vérifiez ici la réponse API brute

            if (response && response.data) {
              this.vehicules = response.data;  // Stocker la liste des véhicules
              console.log('Véhicules du conducteur:', this.vehicules);
            } else {
              console.log('Pas de véhicules trouvés pour ce conducteur.');
            }
          },
          error => {
            console.error('Erreur lors de la récupération des véhicules', error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération des détails du conducteur', error);
      }
    );
  }

  // Méthode pour récupérer les véhicules du conducteur
  fetchVehicules(idConducteur: number): void {
    this.vehiculeService.getAllVehiculesByUserConnected(idConducteur).subscribe(
      response => {

        if (response && response.data) {
          this.vehicules = response.data;  // Stocker la liste des véhicules

          console.log('Véhicules du conducteur:', this.vehicules);
        } else {
          console.log('Pas de véhicules trouvés pour ce conducteur.');
        }
      },
      error => {
        console.error('Erreur lors de la récupération des véhicules', error);
      }
    );
  }
  updateConducteurInfo(conducteurId: number, conducteurData: any): void {
    this.conducteurService.updateConducteur(conducteurId, conducteurData).subscribe({
      next: (response) => {
        console.log('Mise à jour réussie', response);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du conducteur', err);
      }
    });
  }
}
