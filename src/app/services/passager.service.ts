import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassagerService {
  // private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel
  private apiUrl ='https://certif.celinemendy.simplonfabriques.com/api'; 
  // Injecte HttpClient dans le constructeur
  constructor(private http: HttpClient) { }

  // Ajoute ici la méthode `getPassagerByUserId`
  getPassagerByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/passager/user/${userId}`);
  }
}
