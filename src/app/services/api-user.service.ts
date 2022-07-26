import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response} from '../models/response';


const httpOption = {
    headers: new HttpHeaders ({
      'Contend-Type': 'application/json'
    })
  };
  
  @Injectable({
    providedIn: 'root'
  })
  export class ApiConceptoService {
  
    url: string = 'http://www.wsVentas.somee.com/servicios/api/User' 
    //'https://localhost:44395/api/Concepto';
  
    
    constructor(
       private  _http : HttpClient
    ) { }

    getConcepto(idCon: number): Observable<Response>{
        return this._http.get<Response>(this.url+"/"+idCon);
      }
}