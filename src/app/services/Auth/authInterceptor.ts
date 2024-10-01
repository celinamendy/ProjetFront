import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let access_token = localStorage.getItem("access_token");

    // Si aucun access token, poursuivre avec la requête d'origine
    if (!access_token) {
        return next(req);
    }

    // Créer les en-têtes avec le token
    const headers = new HttpHeaders({
        Authorization: `Bearer ${access_token}` // Utiliser des backticks pour les templates
    });

    // Cloner la requête avec les nouveaux en-têtes
    const newRequest = req.clone({
        headers
    });

    return next(newRequest); // Retourner la requête modifiée
}
