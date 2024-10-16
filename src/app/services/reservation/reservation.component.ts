import {  ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpInterceptor} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les réservations avec authentification
  getReservations(): Observable<any> {
    const token = this.getToken(); //  méthode est bien définie
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log("Token utilisé pour la requête:", token); // Log pour débogage

    return this.http.get(this.apiUrl, { headers }).pipe(
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

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    // Log ou gérer l'erreur ici
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }


  addAvis(avisData: FormData): Observable<any> {
    const token = this.getToken(); //  méthode est bien définie
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/avis`, avisData ,{ headers }).pipe(
      catchError(this.handleError) // Gérer les erreurs ici
    );
  }
}