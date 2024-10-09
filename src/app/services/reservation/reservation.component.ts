import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://127.0.0.1:8000/api/reservations';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les réservations avec authentification
  getReservations(): Observable<any> {
    const token = this.getToken(); // Assurez-vous que cette méthode est bien définie
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log("Token utilisé pour la requête:", token); // Log pour débogage

    return this.http.get(this.apiUrl, { headers }).pipe( // Corrigez l'URL ici
      catchError(error => {
        console.error('Erreur lors de la récupération des réservations', error);
        return throwError(() => new Error('Erreur lors de la récupération des réservations'));
      })
    );
  }

  // Méthode pour obtenir les détails d'un utilisateur par ID
  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  // Méthode pour obtenir le token (à définir si ce n'est pas déjà fait)
  private getToken(): string | null {
    return localStorage.getItem('access_token'); // Adaptez cela si nécessaire
  }
}
