import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les en-têtes d'authentification pour les requêtes sécurisées
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  getAllTrajets() {
    return this.http.get(`${this.apiUrl}/trajets`);
  }

  // Méthode pour récupérer tous les trajets disponibles (pour le passager)
  getAvailableTrajets() {
    return this.http.get(`${this.apiUrl}/trajets-disponibles`); // Trajets disponibles aujourd'hui ou à venir
  }

  // Méthode pour récupérer les trajets du conducteur connecté
  getUserTrajets() {
    return this.http.get(`${this.apiUrl}/trajets-user`, this.getAuthHeaders()); // Utiliser les en-têtes d'authentification
  }

  // Méthode pour ajouter un trajet (réservée au conducteur connecté)
  addTrajets(trajet: any) {
    return this.http.post(`${this.apiUrl}/trajets`, trajet, this.getAuthHeaders());
  }

  // Méthode pour mettre à jour un trajet (réservée au conducteur connecté)
  updateTrajets(id: any, trajet: any) {
    return this.http.put(`${this.apiUrl}/trajets/${id}`, trajet, this.getAuthHeaders());
  }

  // Méthode pour archiver un trajet (réservée au conducteur connecté)
  archiveTrajets(id: any) {
    return this.http.delete(`${this.apiUrl}/trajets/${id}`, this.getAuthHeaders());
  }

  // Méthode pour restaurer un trajet archivé (réservée au conducteur connecté)
  restoreTrajets(id: any) {
    return this.http.post(`${this.apiUrl}/trajets/${id}/restore`, {}, this.getAuthHeaders());
  }

  // Méthode pour supprimer définitivement un trajet (réservée au conducteur connecté)
  deleteTrajets(id: any) {
    return this.http.delete(`${this.apiUrl}/trajets/${id}/force-delete`, this.getAuthHeaders());
  }

  // Méthode pour voir les détails d'un trajet (accessible à tout utilisateur)
  getTrajetsDetails(id: any) {
    return this.http.get(`${this.apiUrl}/trajets/${id}`);
  }
}
