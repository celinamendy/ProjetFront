// src/app/models/passenger.model.ts
export interface Passager {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  adresse: string;
  telephone: string;
}

// src/app/models/driver.model.ts
export interface Conducteur {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  adresse: string;
  permisDeConduire: string;
  cni: string;
  carteAssurance: string;
}
