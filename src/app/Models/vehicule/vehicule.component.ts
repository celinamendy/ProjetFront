
// src/app/models/vehicule.model.ts
export interface Vehicule {
  id: number;                // L'identifiant du véhicule
  marque: string;             // La marque du véhicule
  modele: string;             // Le modèle du véhicule
  couleur: string;            // La couleur du véhicule
  immatriculation: string;    // L'immatriculation du véhicule
  conducteur_id: number;      // L'identifiant du conducteur
  nombre_place: number;       // Le nombre de places dans le véhicule
  assurance_vehicule: string; // L'assurance du véhicule
  photo?: string;             // L'URL ou le chemin de la photo du véhicule (optionnel)
}

