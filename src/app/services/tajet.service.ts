import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les Trajets
  getAllTrajets() {
    return this.http.get(`${this.apiUrl}/trajets`);
  }

  // Méthode pour ajouter un Trajet
  addTrajet(trajet: any) {
    return this.http.post(`${this.apiUrl}/trajets`, trajet);
  }

  // Méthode pour mettre à jour un Trajet
  updateTrajet(id: any, trajet: any) {
    return this.http.put(`${this.apiUrl}/trajets/${id}`, trajet); // Utiliser PUT pour les mises à jour
  }

  // Méthode pour archiver un Trajet
  archiveTrajet(id: any) {
    return this.http.delete(`${this.apiUrl}/trajets/${id}`);
  }

  // Méthode pour restaurer un Trajet archivé
  restoreTrajet(id: any) {
    return this.http.post(`${this.apiUrl}/trajets/${id}/restore`, {});
  }

  // Méthode pour supprimer définitivement un Trajet
  deleteTrajet(id: any) {
    return this.http.delete(`${this.apiUrl}/trajets/${id}/force-delete`);
  }
}
