import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

import { environment } from '../../environments/environment';
import { RootStore } from '../store/root.store';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router, private rootStore: RootStore) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // prepend API_URL to request url
    req = req.clone({
      url:
        environment.apiUrl +
        (req.url.charAt(0) === "/" ? req.url : `/${req.url}`)
    });

    // add authorization token to request header
    const token = this.rootStore.userStore.authToken;
    if (token)
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      });

    // if response status 401, redirect to auth
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.rootStore.userStore.clearSettings();
            this.router.navigate(["/auth/login"]);
          }
          return throwError({
            status: err.status,
            body: err.error
          });
        }
      })
    );
  }
}
