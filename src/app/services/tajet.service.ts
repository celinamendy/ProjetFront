// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TajetService {

//   constructor() { }
// }


import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
// import { apiUrl } from "./apiUrl";

@Injectable({
    providedIn: "root"
})

export class TajetService  {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de votre backend Laravel

    private http = inject(HttpClient);

    // Methode pour recuperer toutes les Tajet
    getAllTajet(){
        return this.http.get(`${this.apiUrl}/tajets`);
    }

    // Methode pour ajouter un Tajet
    addTajet(tajet:any){
        return this.http.post(`${this.apiUrl}/tajets`, tajet);
    }

    // Methode pour mettre a jour un Tajet
    updateTajet(id:any, tajet:any){
        return this.http.post(`${this.apiUrl}/tajets/${id}`, tajet);
    }

    // Methode pour archiver un Tajet
    archiveTajet(id:any){
        return this.http.delete(`${this.apiUrl}/tajets/${id}`);
    }

    // Methode pour restaurer un Tajet
    restaureTajet(id:any){
        return this.http.post(`${this.apiUrl}/tajets/${id}/restore`, "");
    }

    // Methode pour supprimer definitivement un Tajet
    deleteTajet(id:any){
        return this.http.delete(`${this.apiUrl}/tajets/${id}/force-delete`);
    }


}
