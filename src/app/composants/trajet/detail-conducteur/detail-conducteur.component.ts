import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // Correct import de HttpClientModule

@Component({
  selector: 'app-detail-trajet-conducteur',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './detail-conducteur.component.html',
  styleUrls: ['./detail-conducteur.component.css']
})
export class DetailTrajetConducteurComponent implements OnInit {
  trajetId!: string;
  trajet: any = {};
  UserId: any | null = null;
  reservations: any[] = [];
  loading: boolean = true;
  trajetsConducteur: any[] = [];
  passager: any[] = [];
  users: any[] = []; // Ajoutez un tableau pour stocker les utilisateurs
  avis: any[] = []; // Déclaration de la propriété 'avis'
  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID du trajet via la route
    this.trajetId = this.route.snapshot.paramMap.get('id')!;
    // Récupération de l'ID de l'utilisateur
    this.UserId = this.getUserId();
    // Chargement des détails du trajet
    this.loadDetails();
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  loadDetails(): void {
    this.loading = true;
    this.trajetService.getTrajetsDetails(this.trajetId).subscribe(
      (response: any) => {
        if (response.status) {
          this.trajet = response.data; // Assurez-vous que vous accédez au bon champ
          console.log(this.trajet); // Ajoutez cette ligne pour vérifier la structure
          this.reservations = this.trajet.reservations || [];
          this.avis = this.trajet.avis || [];
        } else {
          console.error('Erreur :', response.message);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trajet:', error);
      }
    ).add(() => {
      this.loading = false;
    });
}



  goBack(): void {
    this.location.back();
  }

  // Affichage d'un message de succès
  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: message,
      timer: 3000,
      showConfirmButton: false
    });
  }

  // Affichage d'un message d'erreur
  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      showConfirmButton: true
    });
  }
}
