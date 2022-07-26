import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';
import { Venta } from '../models/venta';

const httpOption = {
  headers: new HttpHeaders ({
    'Contend-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiVentaService {

  url:string = 'https://www.wsventas.somee.com/servicios/api/Venta'
  //'https://localhost:44395/api/Venta';

  constructor(
    private _http: HttpClient
  ) { }

add(venta: Venta): Observable<Response>{
  return this._http.post<Response>(this.url, venta,httpOption);
}

getVenta(): Observable<Response>{
  return this._http.get<Response>(this.url);
}

getFechaVenta(fecha: string|undefined): Observable<Response>{
  return this._http.get<Response>(this.url+'/fechaVenta/'+fecha);
}

getInfoVenta(info:number|undefined):Observable<Response>{
  return this._http.get<Response>(this.url+'/IdVenta/'+info)
}

}