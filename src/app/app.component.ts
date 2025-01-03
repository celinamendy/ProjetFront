import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './composants/auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TrajetComponent } from './composants/trajet/trajet.component';
import { AjouterTrajetComponent } from './composants/trajet/ajouter/ajouter.component';
import { ModificationTrajetComponent } from './composants/trajet/modifier/modifier.component';
import { DetailTrajetComponent } from './composants/trajet/detail/detail.component';
import { HeaderComponent } from './composants/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,
    LoginComponent,
    HttpClientModule,
    TrajetComponent,
    AjouterTrajetComponent,
    ModificationTrajetComponent,
    DetailTrajetComponent,
    HeaderComponent,
   
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProjetFront';
}
