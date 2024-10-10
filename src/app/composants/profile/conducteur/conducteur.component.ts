import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth/auth.service';


@Component({
  selector: 'app-conducteur',
  standalone: true,
  imports: [],
  templateUrl: './conducteur.component.html',
  styleUrl: './conducteur.component.css'
})
export class ConducteurComponent implements OnInit  {
  conducteurDetails: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchConducteurDetails();
  }

  fetchConducteurDetails(): void {
    this.authService.getUserDetails().subscribe(
      response => {
        this.conducteurDetails = response.data;
        console.log('Détails du conducteur:', this.conducteurDetails);
      },
      error => {
        console.error('Erreur lors de la récupération des détails du conducteur', error);
      }
    );
  }
}

