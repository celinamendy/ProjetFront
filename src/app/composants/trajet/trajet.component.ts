import { Component, OnInit } from '@angular/core';
// import { Trajet } from '../../models/trajet.model'; // Import du modèle Trajet
import { CommonModule } from '@angular/common';
import { TrajetService } from '../../services/tajet.service';
import { TrajetComponent } from '../../Models/trajet/trajet.component';

@Component({
  selector: 'app-trajet',
  standalone: true,
  imports: [CommonModule], // Ajoutez CommonModule si vous utilisez ngFor, ngIf, etc.
  templateUrl: './trajet.component.html',
  styleUrls: ['./trajet.component.css']
})

export class Trajet implements OnInit {
  trajets: Trajet[] = [];

  constructor(private trajetService: TrajetService) {}

  ngOnInit(): void {
    this.fetchTrajets();
  }

  fetchTrajets() {
    this.trajetService.getAllTrajets().subscribe((response: any )=> {
      this.trajets = response.data;
    }, error => {
      console.error('Erreur lors de la récupération des trajets', error);
    });
  }
}
