import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as jquery from "jquery";
import { Concepto } from "src/app/models/concepto";
import { Venta } from "src/app/models/venta";
import { ApiConceptoService } from "src/app/services/api-concepto.service";
import { MatDialog } from '@angular/material/dialog';
import { ApiClienteService } from "src/app/services/api-cliente.service";
import { ApiProductoService } from "src/app/services/api-producto.service";
import {Response} from '../../models/response';


@Component({
    templateUrl:'./dialogdetalleventa.component.html',
    styleUrls: ['./dialogdetalleventa.component.scss']
})


export class DialogDetalleVentaComponent implements OnInit{
    public lstConceptos: any[] = [];
    public lstClientes: any[] = [];
    public lstProductos: any[] = [];
    public columnas: string[] = ['idCon','precio', 'impuesto', 'idProducto', 'idVenta', 'cantidad'];
    public columnas1: string[] = ['idCli','cedula', 'nombre', 'apellido', 'direccion', 'telefono'];
    public columnas2: string[] = ['idPro', 'nombre', 'precio', 'marca']

    idVen: number = 0
    idCliVen: number = 0;
    conceptos: Concepto[] = []

    ngOnInit(): void {
        this.getDetalleVenta()
    }
    
    constructor(
        public dialogRef: MatDialogRef<DialogDetalleVentaComponent>,
        public snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        public apiConcepto:ApiConceptoService,
        public apiCliente:ApiClienteService,
        public apiProducto:ApiProductoService,
        public dialog:MatDialog,
        @Inject(MAT_DIALOG_DATA) public venta: Venta
    ){
        if(venta !== null){
            this.idCliVen = venta.idCliVen;
            this.idVen = venta.idVen;
        }
    }

    getDetalleVenta(){
        /*
        const venta: Venta = {idVen: this.idVen,
                              id_Cli_Ven: this.id_Cli_Ven,
                              conceptos: this.conceptos};
                              */
                              //console.log(this.idVen)
        this.apiCliente.getClienteId(this.idCliVen).subscribe(response => {
            this.lstClientes = response.data
        })

        this.apiConcepto.getConcepto(this.idVen).subscribe(response => {
            this.getListaProductos(response)
        })
    }

    getListaProductos(resConceptos: Response){
        this.apiProducto.getProducto().subscribe(response => {
          this.crearListaProducto(response, resConceptos)
        })
      }
    
      crearListaProducto(resProductos:Response, resConceptos:Response){
        let arrProductos = resProductos.data
        let arrConceptos = resConceptos.data
        let arreglo:any[]=[]
        this.lstProductos = arrProductos
        this.lstConceptos = arrConceptos
        for(let i=0; i <= this.lstConceptos.length-1; i++){
          for(let j=0; j <= this.lstProductos.length-1; j++){
            if(this.lstProductos[j].idPro == this.lstConceptos[i].idConPro){
              arreglo.push(this.lstProductos[j])
            }
          }
        }
        this.lstProductos = arreglo;
        this.lstConceptos;
      }

    close(){
        this.dialogRef.close()
    }

}