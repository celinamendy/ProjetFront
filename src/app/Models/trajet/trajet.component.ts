
// src/app/models/trajet.model.ts
export interface Trajet {
  point_depart: string;
  point_arrivee: string;
  date_heure_depart: Date;
  conducteur_id: number;
  statut: string;
  nombre_places: number;
  vehicule_id: number;
  prix: number;
}
// // trajet.model.ts
// export interface Trajet {
//   id: number;
//   depart: string;
//   destination: string;
//   date: string; // format YYYY-MM-DD
//   places: number;
//   prix: number;
//   heure: string; // format HH:mm
//   photo: string; // URL de la photo
// }
