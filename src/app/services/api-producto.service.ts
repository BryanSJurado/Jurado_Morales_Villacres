import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "../models/producto";
import { Response} from '../models/response';


const httpOption = {
    headers: new HttpHeaders ({
      'Contend-Type': 'application/json'
    })
  };

  @Injectable({
    providedIn: 'root'
  })
  export class ApiProductoService {

    url: string = 'http://www.wsVentas.somee.com/servicios/api/Producto'
    //'https://localhost:44395/api/Producto';
  
    
    constructor(
       private  _http : HttpClient
    ) { }
  
    getProducto(): Observable<Response>{
      return this._http.get<Response>(this.url);
    }

    getProductoId(idPro: number|undefined): Observable<Response>{
      return this._http.get<Response>(this.url+'/'+idPro)
    }

    getStockProducto(): Observable<Response>{
      return this._http.get<Response>(this.url+'/Stock')
    }

    editProducto(producto: Producto): Observable<Response>{
      return this._http.put<Response>(this.url + '/atualizarStock', producto, httpOption);
    }
  
    ngOnInit(): void {
      
    }
  }