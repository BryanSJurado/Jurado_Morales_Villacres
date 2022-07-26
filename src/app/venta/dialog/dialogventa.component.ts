import { validateHorizontalPosition } from "@angular/cdk/overlay";
import { DatePipe } from "@angular/common";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule, FormControl  } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as jquery from "jquery";
import { Subject } from "rxjs";
import { Cliente } from "src/app/models/cliente";
import { Concepto } from "src/app/models/concepto";
import { Producto } from "src/app/models/producto";
import { Venta } from "src/app/models/venta";
import { ApiClienteService } from "src/app/services/api-cliente.service";
import { ApiProductoService } from "src/app/services/api-producto.service";
import { ApiVentaService } from "src/app/services/apiventa.service";
import {Response} from '../../models/response';
import { DialogclienteComponent } from "./dialogcliente/dialogcliente.component";
import { ModalclienteService } from "./dialogcliente/modalcliente.service";
import { DialogproductoComponent } from "./dialogproducto/dialogproducto.component";
import { ModalproductoService } from "./dialogproducto/modalproducto.service";

@Component({
    selector:'app-dialogventa',
    templateUrl:'dialogventa.component.html'
})



export class DialogVentaComponent implements OnInit{

    id_Cli_Ven: number = 0
    imp_Con: number = 0 
    can_Con: number = 0
    //idCli:string=''
    id_Con_Pro:number =0
    //pro:any;
    //idPro:string|undefined='';
    lst:any[]=[]
    listaCliente:any[]=[]
    listaProducto:any[]=[]
    listaConceptos:any[]=[];
    listaProductosUpdate:any[]=[]
    arr:any[]=[]
    pre_Uni_Con:number=0
    public nuevaImgPro=new Blob();
    datos!:string;
    readonly width:string='695px';

    public idCli:  number=0;
    public cedCli: string ='';
    public nomCli: string ='';
    public apeCli: string ='';
    public genCli: string ='';
    public telCli: string ='';
    public dirCli: string ='';

    public fecha: Date|any = new Date;

    public idPro: string='';
    public nomPro: string = '';
    public preUniPro: number = 0;
    public stockPro: number = 0;

    public venta:Venta;
    public conceptos: Concepto[] = [];
    dtOptions: DataTables.Settings | any = {};
    dtTrigger: Subject<any> = new Subject<any>();

    public producto:Producto

    flag = false;

    @Input() cliente:Cliente
    @Input() pro : Producto

    idVenta:number=0
    
    
    public conceptoForm = this.formBuilder .group({
        can_Con: new FormControl('', [Validators.required]),
        imp_Con: new FormControl('', [Validators.required]),
        id_Con_Pro: new FormControl('', [Validators.required]),
        pre_Uni_Con: new FormControl('', [Validators.required])
        
    });

    ngOnInit(): void {
        this.fecha = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
        this.id_Cli_Ven = 171;
        this.imp_Con = 12;
        this.id_Con_Pro = 6
        this.ID_CON_PRO.setValue(6) 
        this.ID_CON_PRO.valueChanges.subscribe(value => {
            this.idPro = this.conceptoForm.value['id_Con_Pro']  
        })
        this.getListaClientes();
        this.getListaProductos();
        this.obtenerIdVenta();
        
        /*
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            info: true,
            order: [],
            language: {
              "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            },
            responsive: true,
            retrieve: true,
            "columnDefs": [
              {
                "targets": [7],
                "orderable": false
              }
            ]
          };
      
          this.apiCliente.getCliente().subscribe(response => {
            jQuery.noConflict();
            let dtInstance = jQuery('#clienteTabla').DataTable();
            dtInstance.destroy();
            this.listaCliente = response.data
            this.dtTrigger.next(this.listaCliente);
          })

          this.apiProducto.getStockProducto().subscribe(response => {
            jQuery.noConflict();
            let dtInstance = jQuery('#productoTabla').DataTable();
            dtInstance.destroy();
            this.listaProducto = response.data
            this.dtTrigger.next(this.listaProducto);
          })
          */
         console.log(this.cliente)
         console.log(this.pro)
    }    

    constructor(
        public dialogRef: MatDialogRef<DialogVentaComponent>,
        public snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        public apiventa: ApiVentaService,
        public apiCliente: ApiClienteService,
        public apiProducto:ApiProductoService,
        public dialog:MatDialog,
        private datepipe:DatePipe,
        private modalServiceCliente:ModalclienteService,
        private modalServiceProducto:ModalproductoService
        //@Inject(MAT_DIALOG_DATA) public cliente:Cliente,
        //@Inject(MAT_DIALOG_DATA) public producto:Producto,
        //@Inject(MAT_DIALOG_DATA) public venta:Venta
    ){
        /*
        if(this.cliente !== null){
            this.idCli = this.cliente.idCli;
            this.cedCli = this.cliente.cedCli;
            this.nomCli = this.cliente.nomCli;
            this.apeCli = this.cliente.apeCli;
        }
        if(this.producto != null){
            this.idPro = this.producto.idPro;
            this.nomPro = this.producto.nomPro;
            this.preUniPro = this.producto.preUniPro;
            this.stockPro = this.producto.stockPro;
        }
        */
        this.conceptos = [];
        this.venta = {idVen:0,idCliVen:0, conceptos: []};
    }

    close(){
        this.dialogRef.close()
    }

    addConcepto(){
        //let can_Con = jquery('#can_Con').val();
        //let id_Con_Pro = jquery("#id_Con_Pro option:selected").val();
        //let imp_Con = jquery("#imp_Con").val();
        //let pre_Uni_Con = jquery("#pre_Uni_Con").val()
        let idProducto = this.conceptoForm.value['id_Con_Pro']
        let cantidad = this.conceptoForm.value['can_Con']
        this.verificarProducto(idProducto, cantidad);        
    }
    
    verificarProducto(idProducto:number, cantidad: number){
        this.apiProducto.getProductoId(idProducto).subscribe(response => {
            this.crearProducto(response, cantidad)
        })
    }

    crearProducto(responseProducto: Response, cantidad :number){
        let pro  = responseProducto.data
        if(cantidad != null){
            if(cantidad > 0 && cantidad <= pro.stockPro){
                this.conceptos.push(this.conceptoForm.value);
            }else{
                this.snackBar.open('La información no es válida',
            '',{
                duration:2000
            });
            }
        }else{
            this.snackBar.open('La información no es válida',
            '',{
                duration:2000
            });
        }
    }

    submit() {
        //this.datos= this.conceptoForm.value;
        this.datos = this.conceptoForm.value.id_Con_Pro
      }

    getProductoId(){ 
        //console.log(this.idPro)
        this.apiProducto.getProductoId(parseInt(this.idPro)).subscribe(response => {
            this.crearImagen(response);
        }) 
    }

    mostrarProducto(){
        this.idPro = jQuery('#id_Con_Pro').val()?.toString();
        this.apiProducto.getProductoId(parseInt(this.idPro)).subscribe(response => {
            this.crearImagen(response);
        }) 
    }

      crearImagen(res: Response ){
        let arr = res.data
        this.nuevaImgPro = this.base64toBlob(arr.imgPro);
        var image = document.createElement('img'); 
        image.src = URL.createObjectURL(this.nuevaImgPro);
        image.width = 100;
        image.height = 100;
        //console.log(this.lst[i].imgPro)
        document.getElementById('img')?.appendChild(image)
        this.pre_Uni_Con = arr.preUniPro
        this.can_Con = arr.stockPro
      }


    getListaClientes(){
        this.apiCliente.getCliente().subscribe(response => {
        this.listaCliente = response.data
        })
    }

    addVenta(){
        try{
            let id = jQuery('#id_Cli_Ven').val()?.toString();
        if(id) {
            this.idCli = parseInt(id)
        }
        this.venta.idCliVen = this.idCli;
        
        for(let i = 0; i <= this.conceptos.length-1; i++){
            this.conceptos[i].id_Con_Pro = parseInt(this.conceptos[i].id_Con_Pro.toString())
        }
        //this.getListaProductosUpdate(this.conceptos);
        
        this.venta.conceptos = this.conceptos;
        console.log(this.venta)
        this.apiventa.add(this.venta).subscribe(response => {
            if(response.exito === 1){
                this.dialogRef.close();
                this.snackBar.open('Venta hecha con éxito',
                '',{
                    duration:2000
                });
            }else{
                this.snackBar.open('Fallo al realizar la venta..!!',
                '',{
                    duration:2000
                });
            }
        });
        }catch{
            this.snackBar.open('Fallo al realizar la venta..!!',
                '',{
                    duration:3500
                });
        }
    }

    base64toBlob(cadenaImagen:string): Blob {
        let dataStringImg = 'data:text/plain;base64,' + cadenaImagen;
        var arr = dataStringImg != null ? dataStringImg.split(','): this.lst,
        mime = arr[0].match(/:(.*?);/)[1]
        var sliceSize = 1024;
        var byteCharacters = atob(cadenaImagen);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);
    
        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);
    
            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        let img = new Blob(byteArrays, {type:"image/png"})
        return img;
    }

    getListaProductos(){
        this.apiProducto.getStockProducto().subscribe(response => {
            this.getInfoProducto(response)
        })
        /*
        this.apiProducto.getProducto().subscribe(response => {
            this.getInfoProducto(response)
            //this.listaProducto = response.data
        })
        */
    }

    getInfoProducto(res:Response){
        let arrProductos = res.data
        this.listaProducto = arrProductos
        this.getProductoId();
    }

    get ID_CON_PRO() {
        return this.conceptoForm.get('id_Con_Pro') as FormControl;
      }

    getListaProductosUpdate(conceptos: Concepto[]){
        this.apiProducto.getProducto().subscribe(response => {
            this.actualizarStockProducto(response, conceptos)
       })
    }

    actualizarStockProducto(resProductos:Response, concepto:Concepto[]){
        let arrProductos = resProductos.data
        let arrConceptos = concepto
        let arreglo:any[]=[]
        this.listaProductosUpdate = arrProductos
        this.listaConceptos = arrConceptos
        for(let i=0; i <= this.listaConceptos.length-1; i++){
            for(let j=0; j <= this.listaProductosUpdate.length-1; j++){
                if(this.listaProductosUpdate[j].idPro == this.listaConceptos[i].id_Con_Pro){
                    arreglo.push(this.listaProductosUpdate[j])
                }
            }
        }
        for(let b = 0; b <= this.conceptos.length-1; b++){
            for(let a = 0 ; a <= arreglo.length-1; a++){
                if(arreglo[a].idPro == this.conceptos[b].id_Con_Pro){
                    arreglo[a].stockPro = this.conceptos[b].can_Con
                }
            }
        }        
        
        for(let k = 0; k <= arreglo.length-1; k++){
            const producto: Producto = {idPro: arreglo[k].idPro,
                                        nomPro: arreglo[k].nomPro ,
                                        preUniPro: arreglo[k].preUniPro ,
                                        imgPro: arreglo[k].imgPro ,
                                        stockPro: arreglo[k].stockPro,
                                        marPro:arreglo[k].marPro};
            this.apiProducto.editProducto(producto).subscribe(response => {
                if(response.exito === 1){
                    this.dialogRef.close();
                }
            })
        }
    }

    openDialogProducto(){
        this.modalServiceProducto.abrirModal();
        /*
        const dialogref = this.dialog.open(DialogproductoComponent, {
            width: this.width,
          });
          dialogref.afterClosed().subscribe(result => {
            //this.getVentas();
          });
          */
         /*
          jQuery.noConflict();
          $(function (){
            $('#btnProductos').on('click', function() {
                ($('#modalProducto') as any).modal('show');
              })
          })
          */ 
    }

    openDialogoCliente(){
        this.modalServiceCliente.abrirModal();
        
        /*
        const dialogref = this.dialog.open(DialogclienteComponent, {
            width: this.width,
          });
          dialogref.afterClosed().subscribe(result => {
            //this.getVentas();
          });
          */
            /*
          jQuery.noConflict();
          $(function (){
            $('#btnClientes').on('click', function() {
                ($('#modalCliente') as any).modal('show');
              })
          })
          */       
    }
/*
    obtenerCliente(cliente:Cliente){
        if(cliente != null){
            this.idCli = cliente.idCli;
            this.cedCli = cliente.cedCli;
            this.nomCli = cliente.nomCli;
            this.apeCli = cliente.apeCli;
            this.telCli = cliente.telCli;
            this.dirCli = cliente.dirCli;
        }
    }

    obtenerProducto(producto:Producto){
        if(producto != null){
            this.idPro = producto.idPro;
            this.nomPro = producto.nomPro;
            this.preUniPro = producto.preUniPro;
            this.stockPro = producto.stockPro;
        }
    }
    */

    obtenerIdVenta(){
        this.apiventa.getVenta().subscribe(response => {
            this.recorrerArregloVenta(response)
        })
    }

    recorrerArregloVenta(res:Response){
        this.arr = res.data
        let k = 0
        this.idVenta = this.arr[0].idVen + 1
    }
}

