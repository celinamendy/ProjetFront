// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-detail',
//   standalone: true,
//   imports: [],
//   templateUrl: './detail.component.html',
//   styleUrl: './detail.component.css'
// })
// export class DetailComponent {

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFR from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';

registerLocaleData(localeFR, 'fr');

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './detail-trajet.component.html',
  styleUrls: ['./detail-trajet.component.css']
})
export class DetailTrajetComponent implements OnInit {
  trajetId!: string; // ID du trajet à récupérer
  trajet: any; // Objet pour stocker les détails du trajet
  isAvailable: boolean = false; // Propriété pour gérer l'état de disponibilité

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    this.loadDetails();
  }

  loadDetails(): void {
    this.trajetService.getTrajetsDetails(+this.trajetId).subscribe(
      (data: any) => {
        this.trajet = {
          ...data,
          // Vous pouvez ajouter d'autres propriétés ici si nécessaire
        };
        this.isAvailable = this.trajet.statut.trim().toLowerCase() === 'disponible'; // Vérifiez si le trajet est disponible
        console.log('Détails du trajet:', this.trajet);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trajet:', error);
      }
    );
  }

  goBack(): void {
    this.location.back(); // Fonction pour revenir à la page précédente
  }

  reserveTrajet(): void {
    if (this.trajet && this.isAvailable) {
      // Ajoutez votre logique pour réserver le trajet ici
      Swal.fire({
        icon: 'success',
        title: 'Trajet Réservé',
        text: 'Votre réservation a été confirmée.',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de réservation',
        text: 'Ce trajet n\'est pas disponible pour le moment.',
        showConfirmButton: true
      });
    }
  }
}

