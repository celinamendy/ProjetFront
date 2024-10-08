import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode de connexion
  login(identifiant: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, identifiant).pipe(
      tap((response: any) => {
        this.setToken(response.token); // Sauvegarder le token
        
        this.redirectUser(response.user); // Rediriger l'utilisateur selon son rôle
      }),
      catchError(error => {
        console.error('Erreur de connexion', error);
        return throwError(() => new Error('Erreur de connexion'));
      })
    );
  }

  // Méthode d'inscription
  register(identifiant: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, identifiant).pipe(
      tap((response: any) => {
        console.log('Inscription réussie', response);
      }),
      catchError(error => {
        console.error('Erreur d\'inscription', error);
        return throwError(() => new Error('Erreur d\'inscription'));
      })
    );
  }

  // Récupération du profil
  getProfile(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,  // Utilise le token
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    return this.http.get(`${this.apiUrl}/profile`, httpOptions).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du profil', error);
        return throwError(() => new Error('Erreur lors de la récupération du profil'));
      })
    );
  }


  // Redirige l'utilisateur selon son rôle
  // redirectUser(user: any): void {
  //   if (user.role === 'conducteur') {
  //     this.router.navigate(['/trajet']);
  //   } else if (user.role === 'passager') {
  //     this.router.navigate(['/trajets-disponibles']);
  //   } else {
  //     this.router.navigate(['/']);
  //   }
  // }

  private redirectUser(user: any) {
    const roles = user.roles; // Supposons que les rôles sont inclus dans l'objet utilisateur

    if (roles.includes("passager")) {
      this.router.navigate(['/trajet']); // Rediriger vers la page trajet si l'utilisateur est un passager
    } else if (roles.includes("conducteur")) {
      this.router.navigate(['/ajout']); // Rediriger vers la page d'ajout si l'utilisateur est un conducteur
    } else if (roles.includes('admin')) {
      this.router.navigate(['/admin']); // Rediriger vers la page admin si l'utilisateur est un admin
    } else {
      this.router.navigate(['/accueil']); // Rediriger vers la page d'accueil pour tout autre rôle
    }
  }

  // Méthode pour récupérer les détails de l'utilisateur connecté
// getUser(): Observable<any> {
//   return this.http.get(`${this.apiUrl}/users*  `, this.getAuthHeaders()).pipe(
//     catchError(error => {
//       console.error('Erreur lors de la récupération de l\'utilisateur', error);
//       return throwError(() => new Error('Erreur lors de la récupération de l\'utilisateur'));
//     })
//   );
// }
// getUser() {
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//   });
//   return this.http.get('http://127.0.0.1:8000/api/user', { headers });
// }

//stockage dans le localstorage
// getUser() {
//   if (typeof window !== 'undefined' && window.localStorage) {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   } else {
//     console.warn('localStorage is not available.');
//     return null;
//   }
// }
getUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
      return null;
    }
  } else {
    console.warn('localStorage n\'est pas disponible.');
    return null;
  }
}


// getUserId(): number {
//   const user = JSON.parse(localStorage.getItem('user')!); // Ou autre méthode pour stocker et récupérer l'utilisateur connecté
//   return user?.id;
// }

getUserId(): number | null {
  const user = this.getUser(); // Utiliser la méthode centralisée getUser()
  if (user && user.id) {
    return user.id;
  } else {
    console.warn('ID utilisateur introuvable.');
    return null;
  }
}


// Méthode pour obtenir les en-têtes d'authentification
private getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${this.getToken()}` // Utilisez le token stocké
    }
  };
}


  // Sauvegarde du token dans le localStorage
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Méthode pour obtenir le token
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        return this.token || localStorage.getItem('access_token');
    }
    console.warn('localStorage is not available');
    return null; // Retourne null si localStorage n'est pas disponible
}




  // Rafraîchissement du token
  refreshToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/refresh`).pipe(
      tap((response: any) => {
        this.setToken(response.token); // Sauvegarder le nouveau token
      }),
      catchError(error => {
        console.error('Erreur de rafraîchissement du token', error);
        return throwError(() => new Error('Erreur de rafraîchissement du token'));
      })
    );
  }

  // Méthode de déconnexion
  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']); // Redirection vers la page de connexion
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken(); // Vérifie si un token est présent
  }
}
