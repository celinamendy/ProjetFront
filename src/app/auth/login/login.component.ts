// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/Auth/auth.service';
// import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule, NgIf } from '@angular/common';
// import { log } from 'console';


// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,CommonModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })





// export class LoginComponent {
//   loginForm: FormGroup;
//   errorMessage: string = '';
// form: any;

//   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }
//   onSubmit() {
//     if (this.loginForm.valid) {
//       const credentials = this.loginForm.value;
//       this.authService.login(credentials).subscribe({
//         next: (response) => {
//           console.log(response.access_token);
//           console.log('Connexion réussie:', response);

//           // localStorage.setItem('access_token', response.access_token);
//           // localStorage.setItem('roles', JSON.stringify(response.roles));

//           // if (roles.includes('passager')) {
//           //   this.router.navigate(['/accueil']);


//         }
//       },
//         error: (error) => {
//           console.error('Erreur lors de la connexion:', error); // Ajout d'un log pour déboguer
//           // Gestion des erreurs
//           this.errorMessage = error.error?.message || 'Erreur de connexion';
//         }
//       });
//     }
//   }
// }


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Interface pour la réponse d'authentification
interface AuthResponse {
  // access_token: string;
  // roles: string[];
  user: {
    id: number;
    nom: string;
    prenom: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Correction ici
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
         (response:any) => { // Typage explicite
          console.log(response.access_token);
          console.log('Connexion réussie:', response);

          // Sauvegarder le token et les rôles dans localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('roles', JSON.stringify(response.roles));

          // Redirection en fonction des rôles
          if (response.roles=="passager") {
            this.router.navigate(["/register"]);
          } else if (response.roles.includes('admin')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        // error: (error) => {
        //   console.error('Erreur lors de la connexion:', error);
        //   // Gestion des erreurs
        //   this.errorMessage = error.error?.message || 'Erreur de connexion';
        // }
      );
    }
  }
}
