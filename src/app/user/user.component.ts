import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { DialogDeleteComponent } from '../Common/Delete/dialogdelete.component';
import { User } from '../models/user';
import { ApiUserService } from '../services/api-user.service';
import { DialoguserComponent } from './dialog/dialoguser/dialoguser.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public listaUsuarios: any[] = [];
  public columnas: string[] = ['id','cedula','nombre', 'mail', 'telefono','direccion', 'actions'];
  readonly width:string = '400px';
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private apiUsuario: ApiUserService,
    public dialog:MatDialog,
    public snackBar: MatSnackBar) { }

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

    this.apiUsuario.getUsuario().subscribe(response => {
      let dtInstance = $('#usuarioTabla').DataTable();
      dtInstance.destroy();
      this.listaUsuarios = response.data
      this.dtTrigger.next(this.listaUsuarios);
    })
  }

  openAdd(){
    const dialogref = this.dialog.open(DialoguserComponent, {
      width: this.width 
    });
    dialogref.afterClosed().subscribe(result => {
     // this.getClientes();
    });
  }

  Delete(user: User){
    const dialogref = this.dialog.open(DialogDeleteComponent, {
      width: this.width,
    });
    dialogref.afterClosed().subscribe(result => {
      if(result === true){
        this.apiUsuario.deleteUsuario(user.idUsu).subscribe(response =>{
          if(response.exito === 1){
            this.snackBar.open('Usuario eliminado con exito','', {
              duration:2000
            } );
            //this.getClientes();
          }
        })
      }
    });
  }
}
