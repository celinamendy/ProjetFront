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
import { AuthService } from '../../../services/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';


// Interface pour la réponse d'authentification
interface AuthResponse {
  access_token: string;
  roles: string[];
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
  strongPassword: string = '';

//   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }

constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]] // Validation forte du mot de passe
    });

  // Vérifier si l'utilisateur est déjà connecté
  if (localStorage.getItem('access_token')) {
    this.router.navigate(['/']);
  }
}
  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
        (response: AuthResponse) => { // Assurez-vous que AuthResponse est défini
          console.log(response.access_token);
          console.log('Connexion réussie:', response);

          // Sauvegarder le token et les rôles dans localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('user', JSON.stringify(response.user));

          // Redirection en fonction des rôles
          if (response.roles.includes("passager")) {
            this.router.navigate(["/trajet"]);
          } else if (response.roles.includes('admin')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
      //   (error) => {
      //     console.error('Erreur lors de la connexion:', error);
      //     // Gestion des erreurs
      //     this.errorMessage = error.error?.message || 'Erreur de connexion';
      //   }
      );
    }
  }
  // Validateur personnalisé pour la force du mot de passe
  strongPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/.test(password);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (!passwordValid) {
      return { strongPassword: true };
    }
    return null;
  }

  // Accesseurs pour accéder facilement aux champs
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
