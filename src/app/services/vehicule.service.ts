import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel


  constructor(private http: HttpClient) { }

  // Méthode pour récupérer tous les Vehicule
  getAllVehicules() {
    return this.http.get(`${this.apiUrl}/vehicules`);
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
