import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  // login(credentials: { email: string, password: string }): Observable<AuthenticatorResponse> {
  //   return this.http.post<AuthenticatorResponse>(`${this.apiUrl}/login`, credentials);
  // }





  login(identifiant:any) {
    return this.http.post(`${this.apiUrl}/login`, identifiant);
  }
  register(identifiant:any){
    return this.http.post(`${this.apiUrl}/register`, identifiant);
}
getProfile(){
  return this.http.get(`${this.apiUrl}/profile`);
}
// Méthode de déconnexion
// logout(): void {
//   // Supprimer les informations de l'utilisateur, comme le token
//   localStorage.removeItem('token');

//   // Rediriger l'utilisateur vers la page de connexion
//   this.router.navigate(['/login']);
// }

  // Méthode pour obtenir le token (ici, depuis le stockage local ou une variable interne)
  getToken(): string | null {
    // Récupération du token depuis le localStorage ou autre mécanisme
    return this.token || localStorage.getItem('access_token');
  }

  // // Simule une méthode de rafraîchissement de token
  // refreshToken(): Observable<string> {
  //   // Exemple d'appel API pour rafraîchir le token
  //   return this.http.post<string>('/api/refresh-token', { /* Payload ici si nécessaire */ });
  // }
  refreshToken(){
    return this.http.get(`${this.apiUrl}/refresh`);
}

  // Méthode pour définir le token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }
}
