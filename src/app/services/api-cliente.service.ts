import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Response} from '../models/response';

const httpOption = {
  headers: new HttpHeaders ({
    'Contend-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiClienteService {

  url: string = 'https://www.wsventas.somee.com/servicios/api/Cliente'
  //'https://localhost:44395/api/Cliente';

  
  constructor(
     private  _http : HttpClient
  ) { }

  getCliente(): Observable<Response>{
    return this._http.get<Response>(this.url);
  }

  addCliente(cliente: Cliente): Observable<Response>{
    return this._http.post<Response>(this.url, cliente, httpOption);
  }

  editCliente(cliente: Cliente): Observable<Response>{
    return this._http.put<Response>(this.url, cliente, httpOption);
  }

  deleteCliente(idCli: number): Observable<Response>{
    return this._http.delete<Response>(this.url+"/"+idCli);
  }

  getClienteInfo(infoCliente: string|undefined): Observable<Response>{
    return this._http.get<Response>(this.url+"/infoCliente/"+infoCliente)
  }

  getClienteId(idCliente:number):Observable<Response>{
    return this._http.get<Response>(this.url+'/idCliente/'+idCliente)
  }

  ngOnInit(): void {
    
  }
}

