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

  

    addUsuario(){
        const user: User = {idUsu: 0,
                              emailUsu: this.emailUsu,
                              passUsu : this.emailUsu,
                              nomUsu: this.nomUsu,
                              telUsu: this.telUsu,
                              dirUsu: this.dirUsu,
                              cedUsu: this.cedUsu
                              }
          if(this.validarCedula(user.cedUsu)){
            this.apiuser.addUsuario(user).subscribe(response => {
              if(response.exito === 1){
                  this.dialogRef.close();
                  this.snackBar.open('Usuario Insertado con éxito', '',{
                      duration: 2000
                  });
              }else{
                this.snackBar.open('Usuario Insertado con éxito'+ response.mensaje, '',{
                    duration: 2000
                });
              }
            })
          }else{
            alert("Cedula no válida");
          }                      
    }
   

    validarCedula(cedula: string) {
      if (cedula.length === 10) {
          const digitoRegion = cedula.substring(0, 2);
          if (digitoRegion >= String(1) && digitoRegion <= String(24)) {
              const ultimoDigito = Number(cedula.substring(9, 10));
              const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));
              let numeroUno: any = cedula.substring(0, 1);
              numeroUno = (numeroUno * 2);
              if (numeroUno > 9) {
                  numeroUno = (numeroUno - 9);
              }
              let numeroTres: any = cedula.substring(2, 3);
              numeroTres = (numeroTres * 2);
              if (numeroTres > 9) {
                  numeroTres = (numeroTres - 9);
              }

              let numeroCinco: any = cedula.substring(4, 5);
              numeroCinco = (numeroCinco * 2);
              if (numeroCinco > 9) {
                  numeroCinco = (numeroCinco - 9);
              }

              let numeroSiete: any = cedula.substring(6, 7);
              numeroSiete = (numeroSiete * 2);
              if (numeroSiete > 9) {
                  numeroSiete = (numeroSiete - 9);
              }

              let numeroNueve: any = cedula.substring(8, 9);
              numeroNueve = (numeroNueve * 2);
              if (numeroNueve > 9) {
                  numeroNueve = (numeroNueve - 9);
              }

              const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;
              const sumaTotal = (pares + impares);
              const primerDigitoSuma = String(sumaTotal).substring(0, 1);
              const decena = (Number(primerDigitoSuma) + 1) * 10;
              let digitoValidador = decena - sumaTotal;
              if (digitoValidador === 10) {
                  digitoValidador = 0;
              }
              if (digitoValidador === ultimoDigito) {
                  return true;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      } else {
          return false;
      }
  }
}

