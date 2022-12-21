import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,private router:Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const  token  = /**'kunal' **/ 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0MTE5OEJCQzc1MjBBQTRBQzBBRUFEMzUwNjZGRDg2IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NzE2MjkzMjcsImV4cCI6MTY3MTYzMjkyNywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6IkVtcGxveWVlQVBJIiwiY2xpZW50X2lkIjoibTJtLmNsaWVudCIsImp0aSI6IkVENTY5NURGOTM3QkVENjhGMDhBODg0QTlCREMyQjhCIiwiaWF0IjoxNjcxNjI5MzI3LCJzY29wZSI6WyJFbXBsb3llZUFQSS5yZWFkIiwiRW1wbG95ZWVBUEkud3JpdGUiXX0.NTdheCiGQG94yOTD7FUy_kgedSRGQeZpv48WSgGtu8XBND5nE_mc2VBdtXqgYeAu1Mc41WB9-mcBKWNnMi3SEH9DU0ufqNx8AgdFehm_Xt8IWJ9aoCiEJMh2D0kO9aYJHNlk3xK1mNN23-qRfPHcsB9J0NYCeOv3Xvt-8ohTn7lwFpHullVSrkZcbv3sVqgRuYDThVkQdu2m-SDn3lCxSWk0qswDNOGNQxwHags42cosvcSxXbn9vEKqidTS-EeJCsWHbytKEKJUXT5pKH1RK0x7kvUCTQuy5JvwXPLyqVhW2knr-WojfE6orGDehAQ4xi1IyNs2x9j09q9-DszJDA'
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['users/login']);
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}