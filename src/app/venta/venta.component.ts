import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiVentaService } from '../services/apiventa.service';
import { DialogVentaComponent } from './dialog/dialogventa.component';
import {Response} from '../models/response';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Venta } from '../models/venta';
import { DialogDetalleVentaComponent } from './DialogDetalle/dialogdetalleventa.component';
import { Columns, Img, PdfMakeWrapper, Table, Txt, Ul } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ApiConceptoService } from '../services/api-concepto.service';
import { ApiProductoService } from '../services/api-producto.service';
import { HttpResponse } from '@angular/common/http';
import { ApiClienteService } from '../services/api-cliente.service';
import { Subject } from 'rxjs';

PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit {
  public lst: any[] = [];
  public columnas: string[] = ['id','fecha', 'total', 'id_Cli', 'actions'];
  readonly width:string='750px';
  inFechaInicio: Date|any = new Date;
  listaConceptos:any[]=[];
  listaProductos:any[]=[];
  listaResponse:Response[]=[];
  tituloReporte: string = '';
  idVen:number=0;
  idCliente:number=0;
  cliente:any;
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private apiVenta: ApiVentaService,
    private apiConcepto: ApiConceptoService,
    private apiProducto: ApiProductoService,
    private apiCliente: ApiClienteService,
    public dialog:MatDialog,
    public snackBar: MatSnackBar,
    private datepipe:DatePipe,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    //this.getVentas();
    let tmpFecha : Date;
    tmpFecha = new Date();
    this.inFechaInicio = this.datepipe.transform((tmpFecha.getFullYear() +'-'+ (tmpFecha.getMonth()+1) +'-1'), 'yyyy-MM-dd');

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
    this.apiVenta.getVenta().subscribe(response => {
      let dtInstance = $('#ventaTabla').DataTable();
      dtInstance.destroy();
      //this.lst = response.data
      this.formatInfo(response);
      this.dtTrigger.next(this.lst);
    })
  }

  getVentas(){
    this.apiVenta.getVenta().subscribe(response => {
      this.formatInfo(response)
    })
  }

  getFechaVenta(){
    let info = jQuery('#inFecha').val()?.toString();
    let infoNumber = jQuery('#infoVenta').val()?.toString();
    this.apiVenta.getFechaVenta(info).subscribe(response => {
      if(response.data.length != 0){
        this.formatInfo(response)
      }else{
        this.apiVenta.getInfoVenta(parseFloat(infoNumber)).subscribe(response =>{
          this.formatInfo(response);
        })
      }
    })
  }

  formatInfo(res: Response): any{
    let date = new Date()
    let arr = res.data;
    this.lst = arr
    //console.log(this.lst)
    for(let i = 0; i <= this.lst.length-1; i++){
      //console.log(this.lst[i].fecVen)
      date = this.lst[i].fecVen
      let fecha= this.datepipe.transform(date, 'dd/MM/yyyy');
      this.lst[i].fecVen = fecha
    }
    return this.lst;
  }

  openAdd(){
    const dialogRef =  this.dialog.open(DialogVentaComponent, {
      width: this.width
    });
  }

  openDetalle(venta:Venta){
    const dialogref = this.dialog.open(DialogDetalleVentaComponent, {
      width: this.width,
      data: venta
    });
    dialogref.afterClosed().subscribe(result => {
      //this.getVentas();
    });
  }

  obtenerVenta(venta: Venta){
    console.log(venta)
    this.idVen = venta.idVen;
    this.idCliente = venta.idCliVen
    this.getClienteId(this.idCliente)
    this.getConceptos(this.idVen);
  }
  
  getClienteId(idCli:number){
    this.apiCliente.getClienteId(idCli).subscribe(response => {
      this.cliente = response.data
      //console.log(this.cliente)
    })
  }

  getConceptos(idVen:number){
    this.apiConcepto.getConcepto(idVen).subscribe(response => {
      this.getListaProductos(response)
      //this.listaConceptos = response.data
    })
  }

  getListaProductos(res: Response){
    this.apiProducto.getProducto().subscribe(response => {
      this.crearListaProducto(response, res)
    })
  }

  crearListaProducto(resProductos:Response, resConceptos:Response){
    let arrProductos = resProductos.data
    let arrConceptos = resConceptos.data
    let arreglo:any[]=[]
    this.listaProductos = arrProductos
    this.listaConceptos = arrConceptos
    for(let i=0; i <= this.listaConceptos.length-1; i++){
      for(let j=0; j <= this.listaProductos.length-1; j++){
        if(this.listaProductos[j].idPro == this.listaConceptos[i].idConPro){
          arreglo.push(this.listaProductos[j])
        }
      }
    }
    this.listaProductos = arreglo
    this.crearFactura(this.listaProductos, this.listaConceptos)
  }

  async crearFactura(resProductos:any[], resConceptos:any[]){
    //console.log(resConceptos)
    try{
      const pdf = new PdfMakeWrapper();
      pdf.pageSize ('A5') ;
      pdf.pageOrientation('portrait');
      pdf.defaultStyle({
        bold: false,
        fontSize: 9
      });
      pdf.pageMargins([30,100,30,40]);
      let fecha= this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
      pdf.header(new Ul([
        '  ',
        '  ',
        new Columns([
          {width: '3%',text:new Txt('').end},
          //await new Img('../../assets/imagenes/ventas.jpg').build(),
  
          {width: '21%',text:new Txt('VENTAS-Módulo de Facturación de Ventas ').alignment('left').fontSize(9).end, margin: [0, 20, 0, 20]},
  
          {width: '48%',text:new Txt('Factura de Venta ' + this.idVen).alignment('center').fontSize(12).bold().end},
          {width: '19%',text:new Txt('Fecha:  '+fecha).alignment('left').end , margin: [0, 30, 0, 0]}
        ]).end 
      ]).type('none').end);
    
    
      pdf.add(
        new Columns([
          {width:'0%', text: new Txt('').end},
          {width:'60%', text: new Txt('Nombre: ' + this.cliente[0].nomCli + ' ' + this.cliente[0].apeCli).fontSize(9).bold().end},
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'0%', text: new Txt('').end},
          {width:'60%', text: new Txt('Cédula: ' + this.cliente[0].cedCli).fontSize(9).bold().end},
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'0%', text: new Txt('').end},
          {width:'60%', text: new Txt('Teléfono: ' + this.cliente[0].telCli).fontSize(9).bold().end},
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'0%', text: new Txt('').end},
          {width:'60%', text: new Txt('Dirección: ' + this.cliente[0].dirCli).fontSize(9).bold().end},
        ]).end
      )

      pdf.add( pdf.ln(2));
    
      pdf.add(
        new Columns([
          {width:'30%', text: new Txt('').end},
          {width:'50%', text: new Txt('Lista de Productos Pedidos ').fontSize(9).bold().end},
         ]).end
      )

      pdf.add(
        new Columns([
          {width:'34%', text: new Txt('')},
          {width:'25%',text: new Txt('_______________').bold().fontSize(13).end, margin: [0,-12,0,0]}
        ]).end
      )

      let tablaFactura: any[][] = [];
      tablaFactura.push([
        new Txt('Id Producto').alignment('center').bold().fontSize(8).end,
        new Txt('Nombre Producto').alignment('center').bold().fontSize(8).end,
        new Txt('Precio Unitario').alignment('center').bold().fontSize(8).end,
      ]);

      for (let index = 0; index <= resProductos.length-1; index++){
        let row = [];
        row.push(new Txt(resProductos[index].idPro).alignment('center').end);
        row.push(new Txt(resProductos[index].nomPro).alignment('center').end);
        row.push(new Txt('' + this.decimalPipe.transform(resProductos[index].preUniPro, '1.2-2')).alignment('right').end);
        tablaFactura.push(row);
      }
      
      pdf.add( pdf.ln(1));
      pdf.add(new Table(tablaFactura).alignment('center').layout('lightHorizontalLines').headerRows(1).fontSize(7).widths([120,100,60]).end)
      pdf.add( pdf.ln(3));

      pdf.add(
        new Columns([
          {width:'30%', text: new Txt('').end},
          {width:'50%', text: new Txt('Detalle del Costo del Pedido').fontSize(9).bold().end},
         ]).end
      )

      pdf.add(
        new Columns([
          {width:'34%', text: new Txt('')},
          {width:'25%',text: new Txt('_______________').bold().fontSize(13).end, margin: [0,-12,0,0]}
        ]).end
      )

      let tablaFacturaConcepto: any[][] = [];
      tablaFacturaConcepto.push([
        new Txt('Id Producto').alignment('center').bold().fontSize(8).end,
        new Txt('Precio Unitario').alignment('center').bold().fontSize(8).end,
        new Txt('Cantidad').alignment('center').bold().fontSize(8).end,
        new Txt('Costo').alignment('center').bold().fontSize(8).end
      ]);
      let suma=0
      for(let j = 0; j <= resConceptos.length-1; j++){
        let row = [];
        let costo
        row.push(new Txt(resConceptos[j].idConPro).alignment('center').end);
        row.push(new Txt('' + this.decimalPipe.transform(resConceptos[j].preUniCon, '1.2-2')).alignment('right').end);
        row.push(new Txt(resConceptos[j].canCon).alignment('center').end);
        costo = resConceptos[j].preUniCon * resConceptos[j].canCon
        row.push(new Txt('' + this.decimalPipe.transform(costo, '1.2-2')).alignment('right').end)
        tablaFacturaConcepto.push(row);
        suma += costo
      }

      pdf.add( pdf.ln(1));
      pdf.add(new Table(tablaFacturaConcepto).alignment('center').layout('lightHorizontalLines').headerRows(1).fontSize(7).widths([135,60,45,45]).end)
      pdf.add( pdf.ln(1));

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,0,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'74%', text: new Txt('').end},
          {width:'12%', text: new Txt('Subtotal ').fontSize(9).bold().end},
          {width:'9%', text: new Txt('$ ' + this.decimalPipe.transform(suma, '1.2-2')).alignment('left').fontSize(9).bold().end, margin: [0,0,0,0]}
        ]).end
      )

      let ivaTotal = (suma*12)/100

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,-12,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,0,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'74%', text: new Txt('').end},
          {width:'12%', text: new Txt('IVA 12% ').fontSize(9).bold().end},
          {width:'9%', text: new Txt('$ ' + this.decimalPipe.transform(ivaTotal, '1.2-2')).alignment('left').fontSize(9).bold().end, margin: [0,0,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,-12,0,0]}
        ]).end
      )

      let totalVenta = suma+ivaTotal

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,0,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'74%', text: new Txt('').end},
          {width:'12%', text: new Txt('TOTAL ').fontSize(9).bold().end},
          {width:'9%', text: new Txt('$ ' + this.decimalPipe.transform(totalVenta, '1.2-2')).alignment('left').fontSize(9).bold().end, margin: [0,0,0,0]}
        ]).end
      )

      pdf.add(
        new Columns([
          {width:'86%', text: new Txt('')},
          {width:'10%',text: new Txt('_____').bold().fontSize(13).end, margin: [0,-12,0,0]}
        ]).end
      )



      pdf.info({
        title: 'Factura Venta ' + this.idVen,
        author: 'Bryan Jurado',
      });

      pdf.create().getDataUrl((data)=> {
        jQuery('#iframeReporte').attr('src', data);
      });

    } catch(Exception){}   
  }
}
