import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Vehicule } from '../Models/vehicule/vehicule.component'; // Correction du nom du type de la variable
import { catchError } from 'rxjs/operators'; // Importation de catchError


@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel


  constructor(private http: HttpClient) { }

  // Méthode pour récupérer tous les Vehicule
  // Modifiez la signature de la méthode pour accepter des en-têtes
  getAllVehicules(headers?: HttpHeaders): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(this.apiUrl, { headers });
  }

   // Méthode pour récupérer les véhicules du conducteur connecté
   getAllVehiculesByUserConnected(idConducteur: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getVehiculesByConducteurId/${idConducteur}`).pipe(
      catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    // Log ou gérer l'erreur ici
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }


  getVehiculeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicules/${id}`);
  }

  // Méthode pour ajouter un Vehicule
  addVehicule(vehicule: any) {
    return this.http.post(`${this.apiUrl}/vehicules`, vehicule);
  }

  // Méthode pour mettre à jour un Vehicule
  updateVehicule(id: any, vehicule: any) {
    return this.http.put(`${this.apiUrl}/vehicules/${id}`, vehicule); // Utiliser PUT pour les mises à jour
  }

  // Méthode pour archiver un Vehicule
  archiveVehicule(id: any) {
    return this.http.delete(`${this.apiUrl}/vehicules/${id}`);
  }

  // Méthode pour restaurer un Vehicul earchivé
  restoreVehicule(id: any) {
    return this.http.post(`${this.apiUrl}/vehicules/${id}/restore`, {});
  }

  // Méthode pour supprimer définitivement un Vehicule
  deleteVehicule(id: any) {
    return this.http.delete(`${this.apiUrl}/vehicules/${id}/force-delete`);
  }
}
