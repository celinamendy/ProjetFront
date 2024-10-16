import { Component, OnInit } from '@angular/core';
import { Vehicule } from '../../../Models/vehicule/vehicule.component';
import { VehiculeService } from '../../../services/vehicule.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { ConducteurService } from '../../../services/conducteur.service';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.css']
})
export class AjouterComponent implements OnInit {
  vehicule = {
    marque: '',
    modele: '',
    couleur: '',
    immatriculation: '',
    photo: null as File | null ,// Accepte une image
    conducteur_id: null as number | null // Accepte les nombres ou null
      }; // Nouveau véhicule à ajouter

  conducteur: any; // Conducteur connecté
  vehicules: any[] = []; // Liste des véhicules
  selectedVehicule:any[] = []; // Véhicule sélectionné pour afficher les détails
  selectedFile: File | null = null;

  constructor(private vehiculeService: VehiculeService,
    private conducteurService: ConducteurService,

  ) {}

  ngOnInit(): void {
    this.getVehicules(); // Charger la liste des véhicules au démarrage
    this.getConducteurByUserId(); // Charger le conducteur connecté
  }

  getConducteurByUserId() {
    this.conducteurService.getConducteurByUserId().subscribe(
      (response) => {
        this.conducteur = response.data[0];
      },
      error => {
        console.error('Erreur lors de la récupération du conducteur', error);
      }
    );
  }



  onFileSelected(event: any): void {
    const file = event.target.files[0];  // Select the first file if multiple files are selected
    if (file) {
      this.selectedFile = file;
      console.log('Fichier sélectionné :', this.selectedFile);
    }
  }


  // Méthode pour ajouter un véhicule
  // addVehicule() {
  //   const formData = new FormData();

  //   // Ajout des champs du véhicule à l'objet FormData
  //   formData.append('id', this.vehicule.marque);
  //   formData.append('marque', this.vehicule.marque);
  //   formData.append('modele', this.vehicule.modele);
  //   formData.append('couleur', this.vehicule.couleur);
  //   formData.append('immatriculation', this.vehicule.immatriculation);
  //   // formData.append('photo', this.vehicule.photo);

  //   const conducteur = localStorage.getItem('conducteur');
  //   const conducteur_id = conducteur ? JSON.parse(conducteur).id : null;
  //   console.log(conducteur_id);

  //   // Si conducteur_id est non nul, on l'ajoute à FormData
  //   if (conducteur_id !== null) {
  //     formData.append('conducteur_id', conducteur_id);
  //   }
  //   // Sinon, on ne l'ajoute pas à FormData
  //   else {
  //     console.warn('Aucun conducteur connecté');
  //   }

  //   // Appel du service pour ajouter le véhicule
  //   this.vehiculeService.addVehicule(formData).subscribe(
  //     (response) => {
  //       console.log('Véhicule ajouté avec succès:', response);
  //       this.getVehicules(); // Mettre à jour la liste des véhicules après ajout
  //       this.resetVehiculeForm(); // Réinitialiser le formulaire
  //     },
  //     (error) => {
  //       console.error('Erreur lors de l\'ajout du véhicule:', error);
  //     }
  //   );




  //   // Appel du service pour ajouter le véhicule
  //   this.vehiculeService.addVehicule(formData).subscribe(
  //     (response) => {
  //       console.log('Véhicule ajouté avec succès:', response);
  //       this.getVehicules(); // Mettre à jour la liste des véhicules après ajout
  //       this.resetVehiculeForm(); // Réinitialiser le formulaire
  //     },
  //     (error) => {
  //       console.error('Erreur lors de l\'ajout du véhicule:', error);
  //     }
  //   );
  // }



  addVehicule() {
    const formData = new FormData();

    // Ajout des champs du véhicule à l'objet FormData
    formData.append('marque', this.vehicule.marque);
    formData.append('modele', this.vehicule.modele);
    formData.append('couleur', this.vehicule.couleur);
    formData.append('immatriculation', this.vehicule.immatriculation);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }
// Ajouter l'image sélectionnée si elle existe
// if (form.photo) {
//   formData.append('photo', form.photo);
// }


    const conducteur_ID =this.conducteur.id;

    // Si conducteur_id est non nul, on l'ajoute à FormData
    if (conducteur_ID !== null) {
        formData.append('conducteur_id', conducteur_ID); // Convertir en chaîne si nécessaire
    } else {
        console.warn('Aucun conducteur connecté');
        return; // Quitter la fonction si aucun conducteur n'est connecté
    }

    // Appel du service pour ajouter le véhicule
    this.vehiculeService.addVehicule(formData).subscribe(
        (response) => {
            console.log('Véhicule ajouté avec succès:', response);
            this.getVehicules(); // Mettre à jour la liste des véhicules après ajout
            this.resetVehiculeForm(); // Réinitialiser le formulaire
        },
        (error) => {
            console.error('Erreur lors de l\'ajout du véhicule:', error);
        }
    );
}

  // Méthode pour récupérer tous les véhicules
// Méthode pour récupérer tous les véhicules
getVehicules() {
  this.vehiculeService.getAllVehicules().subscribe(
      (response: any) => {
          console.log('Réponse de l\'API:', response); // Gardez ceci pour déboguer
          if (response.status && Array.isArray(response.data)) {
              this.vehicules = response.data; // Utilisez le tableau dans 'data'
          } else {
              console.error('La réponse n\'est pas au format attendu:', response);
          }
      },
      (error) => {
          console.error('Erreur lors de la récupération des véhicules:', error);
      }
  );
}


  // Méthode pour afficher les détails d'un véhicule
 // Méthode pour afficher les détails d'un véhicule
 showVehiculeDetails(id: number) {
  this.vehiculeService.getVehiculeById(id).subscribe(
    (response: any) => {
      console.log('Détails du véhicule:', response);
      this.selectedVehicule = response; // Assigner les détails du véhicule sélectionné
    },
    (error) => {
      console.error('Erreur lors de la récupération des détails du véhicule:', error);
    }
  );
}

  // Méthode pour supprimer un véhicule
  deleteVehicule(id: number) {
    this.vehiculeService.deleteVehicule(id).subscribe(
      (response) => {
        console.log('Véhicule supprimé avec succès:', response);
        this.getVehicules(); // Mettre à jour la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }

  // Réinitialiser le formulaire
  resetVehiculeForm() {
    this.vehicule = {
      marque: '',
      modele: '',
      couleur: '',
      immatriculation: '',
      photo: null, // Accepte une image
      conducteur_id: null
    };
  }
}
