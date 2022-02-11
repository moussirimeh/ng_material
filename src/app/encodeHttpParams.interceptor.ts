import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpParams,
  HttpParameterCodec,
  HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class EncodeHttpParamsInterceptor implements HttpInterceptor {
  /*intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req);
    let parametres = '';
    if (req.params.toString() !== '') {
      parametres = req.params.toString();
    } else {
      parametres =  req.url.substring(req.url.indexOf('?') + 1, req.url.length);
    }
    console.log(parametres);
    if (req.method === 'GET') {
      const params = new HttpParams({
        encoder: new CustomEncoder(),
        // fromString: req.url.substring(req.url.indexOf('?') + 1, req.url.length),
        fromString: parametres
      });
      const dupReq = req.clone({
        url: req.url.substring(0, req.url.indexOf('?')),
      });
      console.log(params);
      return next.handle(dupReq.clone({ params }));
    } else {
      return next.handle(req.clone());
    }
  }*/
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = new HttpParams({encoder: new CustomEncoder(), fromString: req.params.toString()});
    return next.handle(req.clone({params}));
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
