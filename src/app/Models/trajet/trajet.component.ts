
// src/app/models/trajet.model.ts
// trajet.model.ts (or trajet.component.ts if the model is within the same file)
export interface Trajet {
  id: number;
  point_depart: string;
  point_arrivee: string;
  date_depart: string; // Ensure this property exists
  heure_depart: string; // Ensure this property exists
  conducteur_id: number;
  vehicule_id: number;
  statut: string;
  prix: number;
  nombre_places: number;
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
