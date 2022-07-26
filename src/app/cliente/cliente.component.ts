import { Component, OnInit } from '@angular/core';
import { ApiClienteService } from '../services/api-cliente.service';
import { DialogClienteComponent } from './Dialog/dialogcliente.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Cliente } from '../models/cliente';
import { DialogDeleteComponent } from '../Common/Delete/dialogdelete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({ 
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  public listaCliente: any[] = [];
  public columnas: string[] = ['id','cedula','nombre', 'apellido', 'genero', 'telefono', 'direccion', 'actions'];
  readonly width:string = '300px';
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private apiCliente: ApiClienteService,
    public dialog:MatDialog,
    public snackBar: MatSnackBar
  ) { 
  }

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
    //this.getClientes();
  }

  getClientes(){
    this.apiCliente.getCliente().subscribe(response => {
      this.listaCliente = response.data;
    })
  }

  getInfoCliente(){
    let info = jQuery('#inInfo').val()?.toString();
    this.apiCliente.getClienteInfo(info).subscribe(response => {
      this.listaCliente = response.data;
    })
  }


  openAdd(){
    const dialogref = this.dialog.open(DialogClienteComponent, {
      width: this.width 
    });
    dialogref.afterClosed().subscribe(result => {
     // this.getClientes();
    });
  }

  openEdit(cliente:Cliente){
    const dialogref = this.dialog.open(DialogClienteComponent, {
      width: this.width,
      data: cliente
    });
    dialogref.afterClosed().subscribe(result => {
      //this.getClientes();
    });
  }

  Delete(cliente: Cliente){
    const dialogref = this.dialog.open(DialogDeleteComponent, {
      width: this.width,
    });
    dialogref.afterClosed().subscribe(result => {
      if(result === true){
        this.apiCliente.deleteCliente(cliente.idCli).subscribe(response =>{
          if(response.exito === 1){
            this.snackBar.open('Cliente eliminado con exito','', {
              duration:2000
            } );
            //this.getClientes();
          }
        })
      }
    });
  }

}
