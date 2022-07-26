import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { Usuario } from 'src/app/models/usuario';
import { ApiUserService } from 'src/app/services/api-user.service';

@Component({
  selector: 'app-dialoguser',
  templateUrl: './dialoguser.component.html',
  styleUrls: ['./dialoguser.component.scss']
})
export class DialoguserComponent implements OnInit {


    public emailUsu: string ='';
    public passUsu: string='';
    public nomUsu: string='';
    public telUsu: string='';
    public dirUsu: string='';
    public cedUsu: string ='';

    constructor(
        public dialogRef: MatDialogRef<DialoguserComponent>,
        public apiuser:ApiUserService,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public usuario:User
    ){
        if(usuario !== null){
            this.emailUsu = this.usuario.emailUsu;
            this.passUsu = this.usuario.passUsu;
            this.nomUsu = this.usuario.nomUsu;
            this.telUsu = this.usuario.telUsu;
            this.dirUsu = this.usuario.dirUsu;
            this.cedUsu = this.usuario.cedUsu;
        }
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

    close(){
        this.dialogRef.close();
    }

  

    addCliente(){
        const user: User = {idUsu: 0,
                              emailUsu: this.emailUsu,
                              passUsu : this.emailUsu,
                              nomUsu: this.nomUsu,
                              telUsu: this.telUsu,
                              dirUsu: this.dirUsu,
                              cedUsu: this.cedUsu
                              }
        this.apiuser.addUsuario(user).subscribe(response => {
            if(response.exito === 1){
                this.dialogRef.close();
                this.snackBar.open('Usuario Insertado con éxito', '',{
                    duration: 2000
                });
            }
        })
    }
}

