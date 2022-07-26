import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ApiUserService } from '../services/api-user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public listaUsuarios: any[] = [];
  public columnas: string[] = ['id','cedula','nombre', 'mail', 'telefono','direccion', 'actions'];
  readonly width:string = '300px';
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



}
