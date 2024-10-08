import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFR from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import { TrajetService } from '../../../services/tajet.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

registerLocaleData(localeFR, 'fr');

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailTrajetComponent implements OnInit {
  trajetId!: string; // ID du trajet à récupérer
  trajet: any; // Objet pour stocker les détails du trajet
  isAvailable: boolean = false; // Propriété pour gérer l'état de disponibilité
  newComment: string = ''; // Pour stocker le commentaire nouvellement ajouté

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.trajetId = this.route.snapshot.paramMap.get('id')!; // Récupération de l'ID du trajet depuis l'URL
    this.loadDetails(); // Chargement des détails du trajet
  }

  loadDetails(): void {
    this.trajetService.getTrajetsDetails(+this.trajetId).subscribe( // Ensure the service method is correctly named
      (data: any) => {
        this.trajet = {
          ...data,
          comments: data.comments || [] // Assurez-vous que la propriété comments est initialisée
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

  addComment(): void {
    if (this.newComment.trim()) {
      const comment = {
        nom: 'Utilisateur', // Vous pouvez récupérer le nom de l'utilisateur connecté
        message: this.newComment,
        date: new Date()
      };
      this.trajet.comments.push(comment); // Ajoutez le commentaire à la liste
      this.newComment = ''; // Réinitialisez le champ de commentaire
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un commentaire valide.',
        showConfirmButton: true
      });
    }
  }
}
