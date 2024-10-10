import { Injectable } from '@angular/core';
import { apiUrl } from './apiUrl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConducteurService {

  constructor(private http: HttpClient) {}


  getConducteurByUserId(): Observable<any> {
    return this.http.get(`${apiUrl}/getConducteurByUserId`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    // Log ou gérer l'erreur ici
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }



}
