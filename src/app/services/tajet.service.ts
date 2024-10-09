import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './Auth/auth.service';
import { Observable, throwError } from 'rxjs'; // Ajout de throwError
import { catchError } from 'rxjs/operators'; // Importation de catchError

@Injectable({
  providedIn: 'root'
})
export class TrajetService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les en-têtes d'authentification pour les requêtes sécurisées
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    // Log ou gérer l'erreur ici
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }

  // Méthode pour récupérer tous les trajets disponibles (pour le passager)
  getAllTrajets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trajets`).pipe(
      catchError(this.handleError)
    );
  }
// trajet.service.ts
getTrajetsByVehiculeId(vehiculeId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/trajets/vehicule/${vehiculeId}`);
}

  // Méthode pour récupérer tous les trajets disponibles (pour le passager)
  getTrajetByConducteurId(conducteur_Id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getTrajetByconducteurId/${conducteur_Id}`);
   }
  // getTrajetByConducteurId(trajetId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/trajets/trajet/${trajetId}`);
  // }
  // // Récupérer les trajets par conducteur
  // getTrajetsByConducteur(conducteurId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/trajets/conducteur/${conducteurId}`);
  // }

  // Méthode pour récupérer les trajets du conducteur connecté
  getUserTrajets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trajets`).pipe(
      catchError(this.handleError)
    );
  }

  // // Méthode pour ajouter un trajet (réservée au conducteur connecté)
  // addTrajets(trajet: FormData): Observable<any> { // Utilisation de FormData
  //   return this.http.post<any>(`${this.apiUrl}/trajets`, trajet, this.getAuthHeaders()).pipe(
  //     catchError(this.handleError) // Gestion des erreurs
  //   );
  // }


  addTrajets(trajetData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/trajets`, trajetData).pipe(
      catchError(this.handleError) // Gérer les erreurs ici
    );
  }

  private catchError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error); // Afficher l'erreur dans la console
    throw new Error('Erreur lors de la requête'); // Vous pouvez également lancer une erreur
  }

  // Méthode pour mettre à jour un trajet (réservée au conducteur connecté)
  updateTrajets(id: any, trajet: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/trajets/${id}`, trajet, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour supprimer définitivement un trajet (réservée au conducteur connecté)
  deleteTrajets(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/trajets/${id}/force-delete`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour voir les détails d'un trajet (accessible à tout utilisateur)
  getTrajetsDetails(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/trajets/${id}`).pipe(
      catchError(this.handleError)
    );
  }
// Méthode pour ajouter une reservation
  addreserveTrajet(reservationData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservations`, reservationData).pipe(
      catchError(this.handleError) // Gérer les erreurs ici
    );
  }
  // Méthode pour récupérer la listes des reserves
  getAllreserveTrajet(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trajets`).pipe(
      catchError(this.handleError)
    );
  }
}

