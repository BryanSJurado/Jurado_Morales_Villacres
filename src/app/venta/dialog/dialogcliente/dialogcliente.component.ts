import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { ApiClienteService } from 'src/app/services/api-cliente.service';
import { DialogVentaComponent } from '../dialogventa.component';
import { ModalclienteService } from './modalcliente.service';

@Component({
  selector: 'app-dialogcliente',
  templateUrl: './dialogcliente.component.html',
  styleUrls: ['./dialogcliente.component.scss']
})
export class DialogclienteComponent implements OnInit {

  listaCliente:any[]=[]
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  elementoSeleccionado:Cliente;



  constructor(
    private apiCliente:ApiClienteService,
    public dialog:MatDialog,
    public modalService:ModalclienteService,
    public dialogRef: MatDialogRef<DialogclienteComponent>,
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

    this.apiCliente.getCliente().subscribe(response => {
      let dtInstance = $('#clienteTabla').DataTable();
      dtInstance.destroy();
      this.listaCliente = response.data
      this.dtTrigger.next(this.listaCliente);
    })
  }

  openVenta(cliente:Cliente){
    this.elementoSeleccionado = cliente
    this.modalService.cerrarModal();
    /*
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(result => {
      data: this.elementoSeleccionado
    })
    */
    /*
    const dialogref = this.dialog.open(DialogVentaComponent, {
      data: cliente 
    });
    dialogref.afterClosed().subscribe(result => {
      //this.getClientes();
    });
    */
  }
}
