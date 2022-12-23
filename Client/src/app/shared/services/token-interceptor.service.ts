import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError,from } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  token: string;
  constructor(private authService: AuthService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.getAccessToken().then((tokenValue:string) => { this.token = tokenValue;})
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return next.handle(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        this.router.navigate(['auth']);
      }
      return throwError(error);
    })
  )
  }
}