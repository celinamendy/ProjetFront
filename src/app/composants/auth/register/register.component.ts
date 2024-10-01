// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Passager, Conducteur } from '../../../Models/user/user.model'; // Vérifiez que le chemin d'importation est correct
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.css'] // Corrigé en styleUrls
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isDriver = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      type: ['passenger', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: [''], // Ajouté pour le passager
      permisDeConduire: [''],
      cni: [''],
      carteAssurance: ['']
    });
  }

  ngOnInit(): void {
    // Écoute les changements sur le type d'utilisateur
    this.registerForm.get('type')?.valueChanges.subscribe(() => {
      this.onTypeChange();
    });
  }

  onTypeChange() {
    this.isDriver = this.registerForm.get('type')?.value === 'driver';
    // Réinitialiser les champs spécifiques au conducteur si le type change
    if (!this.isDriver) {
      this.registerForm.patchValue({
        permisDeConduire: '',
        cni: '',
        carteAssurance: ''
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      if (userData.type === 'passenger') {
        const passager: Passager = {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          password: userData.password,
          adresse: userData.adresse,
          telephone: userData.telephone // Vérifiez que ce champ existe pour le passager
        };
        this.sendPassengerData(passager);
      } else {
        const conducteur: Conducteur = {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          password: userData.password,
          adresse: userData.adresse,
          permisDeConduire: userData.permisDeConduire,
          cni: userData.cni,
          carteAssurance: userData.carteAssurance
        };
        this.sendDriverData(conducteur);
      }
    }
  }

  sendPassengerData(passager: Passager) {
    // Envoyer les données du passager au backend
    console.log('Données du passager:', passager);
    // Ajoutez ici votre logique pour envoyer les données au backend
  }

  sendDriverData(conducteur: Conducteur) {
    // Envoyer les données du conducteur au backend
    console.log('Données du conducteur:', conducteur);
    // Ajoutez ici votre logique pour envoyer les données au backend
  }
}
