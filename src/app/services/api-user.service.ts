import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response} from '../models/response';
import { User } from "../models/user";


const httpOption = {
    headers: new HttpHeaders ({
      'Contend-Type': 'application/json'
    })
  };
  
  @Injectable({
    providedIn: 'root'
  })
  export class ApiUserService {
  
    url: string = 'http://www.wsVentas.somee.com/servicios/api/User' 
    //'https://localhost:44395/api/Concepto';
  
    
    constructor(
       private  _http : HttpClient
    ) { }

    getUsuario(): Observable<Response>{
        return this._http.get<Response>(this.url);
      }
    
      addUsuario(usuario:User): Observable<Response>{
        return this._http.post<Response>(this.url + '/AddUser', usuario, httpOption);
      }

    
      deleteUsuario(idUsu: number): Observable<Response>{
        return this._http.delete<Response>(this.url+"/"+idUsu);
      }


}