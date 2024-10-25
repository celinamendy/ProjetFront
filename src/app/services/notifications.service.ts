import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpInterceptor} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les réservations avec authentification
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications`).pipe(

    );
  }

// Méthode d'envoi de notification
sendNotification(title: string, message: string, userId: number): Observable<any> {
  const notificationData = {
    title: title,
    message: message,
    userId: userId
  };
  return this.http.post(`${this.apiUrl}/notifications`, notificationData);
}


  // Méthode pour obtenir le token (à définir si ce n'est pas déjà fait)
  private getToken(): string | null {
    return localStorage.getItem('access_token'); // Adaptez cela si nécessaire
  }


}
