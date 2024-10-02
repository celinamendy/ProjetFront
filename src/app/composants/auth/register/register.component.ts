import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Passager, Conducteur } from '../../../Models/user/user.model'; // Vérifiez que le chemin d'importation est correct
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/Auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Injections
  private authService = inject(AuthService);

  registerForm: FormGroup;
  isDriver = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      type: ['passager', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      adresse: ['', Validators.required],
      telephone: [''], // Ajouté pour le passager
      permisDeConduire: [''], // Champ spécifique au conducteur
      cni: [''], // Champ spécifique au conducteur
      carteAssurance: [''] // Champ spécifique au conducteur
    });
  }

  ngOnInit(): void {
    // Écoute les changements sur le type d'utilisateur
    this.registerForm.get('type')?.valueChanges.subscribe(() => {
      this.onTypeChange();
    });
  }

  onTypeChange() {
    this.isDriver = this.registerForm.get('type')?.value === 'conducteur';
    // Réinitialiser les champs spécifiques au conducteur si le type change
    if (this.isDriver) {
      this.registerForm.patchValue({
        permisDeConduire: '',
        cni: '',
        carteAssurance: ''
      });
    } else {
      // Réinitialiser les champs spécifiques au passager si le type est changé
      this.registerForm.patchValue({
        telephone: ''
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      // Assurez-vous que le type est correctement envoyé
      console.log('Données d\'inscription:', userData);

      const userToRegister = {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        password: userData.password,
        adresse: userData.adresse,
        type: userData.type, // Assurez-vous d'inclure le type ici
      };

      // Inclure des champs spécifiques au conducteur si le type est 'conducteur'
      // if (userData.type === 'conducteur') {
      //   userToRegister.permisDeConduire = userData.permisDeConduire;
      //   userToRegister.cni = userData.cni;
      //   userToRegister.carteAssurance = userData.carteAssurance;
      // } else {
      //   userToRegister.telephone = userData.telephone;
      // }

      this.authService.register(userToRegister).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
        }
      });
    }
  }

  sendPassengerData(passager: Passager) {
    this.authService.register(passager).subscribe({
      next: (response) => {
        console.log('Inscription du passager réussie:', response);
        this.router.navigate(['/login']); // Redirection après l'inscription réussie
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription du passager:', error);
        // Gérez les erreurs ici, par exemple en affichant un message d'erreur
      }
    });
  }

  sendDriverData(conducteur: Conducteur) {
    this.authService.register(conducteur).subscribe({
      next: (response) => {
        console.log('Inscription du conducteur réussie:', response);
        this.router.navigate(['/login']); // Redirection après l'inscription réussie
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription du conducteur:', error);
        // Gérez les erreurs ici, par exemple en affichant un message d'erreur
      }
    });
  }
}
