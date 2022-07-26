import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ApiProductoService } from 'src/app/services/api-producto.service';
import { DialogVentaComponent } from '../dialogventa.component';
import { ModalproductoService } from './modalproducto.service';

@Component({
  selector: 'app-dialogproducto',
  templateUrl: './dialogproducto.component.html',
  styleUrls: ['./dialogproducto.component.scss']
})
export class DialogproductoComponent implements OnInit {

  listaProductos:any[]=[]
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  elementoSeleccionado:Producto
  

  constructor(
    private apiProducto:ApiProductoService,
    public dialog:MatDialog,
    public dialogRef: MatDialogRef<DialogproductoComponent>,
    public modalService: ModalproductoService
  ) { }

  ngOnInit(): void {
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

    this.apiProducto.getProducto().subscribe(response => {
      let dtInstance = $('#productoTabla').DataTable();
      dtInstance.destroy();
      this.listaProductos = response.data
      this.dtTrigger.next(this.listaProductos);
    })
  }

  openVenta(producto:Producto){
    this.elementoSeleccionado = producto
    this.modalService.cerrarModal();
/*
    const dialogref = this.dialog.(DialogVentaComponent, {
      
    });
    */
   /*
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(result => {
      data: producto
    })
  }
  */

  }
} 
