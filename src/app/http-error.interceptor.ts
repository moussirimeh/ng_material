import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';

import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          // console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          // document.getElementById('myApp').style.display = 'none';
          switch (error.status) {
            case 404: {
                alert(`Not Found : veuillez contacter le service informatique`);
                break;
            }
            case 403: {
                alert(`Access Denied : veuillez contacter le service informatique`);
                break;
            }
            case 500: {
                alert(`Internal Server Error : veuillez contacter le service informatique`);
                break;
            }
            default: {
                alert(`Server Error : veuillez contacter le service informatique`);
                break;
            }
          }


          localStorage.removeItem('isLoggedin');
          // localStorage.removeItem('login');
          localStorage.removeItem('selectedMenu');
          localStorage.removeItem('mdp');

          this.router.navigate(['/login']);
        }
        // If you want to return a new response:
        // return of(new HttpResponse({body: [{name: "Default value..."}]}));

        // If you want to return the error on the upper level:
        // return throwError(error);

        // or just return nothing:
        return EMPTY;
      })
    );
  }
}
