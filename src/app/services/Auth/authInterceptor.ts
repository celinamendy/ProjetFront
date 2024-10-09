// import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
// import { Observable } from "rxjs";

// export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//     let access_token = localStorage.getItem("access_token");

//     // Si aucun access token, poursuivre avec la requête d'origine
//     if (!access_token) {
//         return next(req);
//     }

//     // Créer les en-têtes avec le token
//     const headers = new HttpHeaders({
//         Authorization: `Bearer ${access_token}` // Utiliser des backticks pour les templates
//     });

//     // Cloner la requête avec les nouveaux en-têtes
//     const newRequest = req.clone({
//         headers
//     });

//     return next(newRequest); // Retourner la requête modifiée
// }

//le bon

// import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
// import { Observable } from "rxjs";

// export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//     // Vérification si on est dans un environnement navigateur (côté client)
//     let access_token: string | null = null;

//     if (typeof window !== 'undefined' && localStorage) {
//         access_token = localStorage.getItem("access_token");
//     }

//     // Si aucun access token, poursuivre avec la requête d'origine
//     if (!access_token) {
//         return next(req);
//     }

//     // Créer les en-têtes avec le token
//     const headers = new HttpHeaders({
//         Authorization: `Bearer ${access_token}`

//     });

//     // if (token) {
//     //   const clonedRequest = req.clone({
//     //     headers: new HttpHeaders({
//     //       'Authorization': Bearer ${token},
//     //       'Content-Type': 'application/json',
//     //     }),
//     //   });



//     // Cloner la requête avec les nouveaux en-têtes
//     const newRequest = req.clone({
//         headers
//     });

//     return next(newRequest);
// }

import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    // Vérifier si le token est disponible dans le localStorage
    let access_token: string | null = null;

    if (typeof window !== 'undefined' && localStorage) {
        access_token = localStorage.getItem("access_token");
    }

    // Si aucun token, on poursuit la requête originale
    if (!access_token) {
        return next(req);
    }

    // Vérifier si c'est une requête FormData pour éviter de définir Content-Type
    const isFormData = req.body instanceof FormData;

    // Construire les en-têtes avec le token
    let headers = new HttpHeaders({
        Authorization: `Bearer ${access_token}`
    });

    // Cloner la requête en ajoutant uniquement l'en-tête Authorization
    const clonedRequest = req.clone({
        headers
    });

    // Poursuivre avec la requête clonée
    return next(clonedRequest);
}
