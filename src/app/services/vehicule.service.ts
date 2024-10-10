import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Vehicule } from '../Models/vehicule/vehicule.component';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // URL de l'API



    constructor(private http: HttpClient) { }




  // Récupérer tous les véhicules
  // getAllVehicules(): Observable<Vehicule[]> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.getToken()}`,
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //     }),
  //   };

  //   return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules`, httpOptions).pipe(
  //     catchError(this.handleError)  // Gérer les erreurs
  //   );
  // }
 getAllVehicules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicules`).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour récupérer les véhicules du conducteur connecté
  getAllVehiculesByUserConnected(idConducteur: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getVehiculesByConducteurId/${idConducteur}`).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }

  // Récupérer un véhicule par son ID
  getVehiculeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicules/${id}`);
  }

  // Ajouter un véhicule
  addVehicule(vehicule: FormData): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.apiUrl}/vehicules`, vehicule);
}


  // Mettre à jour un véhicule
  updateVehicule(id: any, vehicule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/vehicules/${id}`, vehicule);
  }

  // Supprimer définitivement un véhicule
  deleteVehicule(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicules/${id}/force-delete`);
  }

  // Fonction pour récupérer le token
  private getToken(): string {
    return localStorage.getItem('token') || '';  // Supposons que le token est stocké dans localStorage
  }
}
