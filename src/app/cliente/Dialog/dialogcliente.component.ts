import {Component, Inject} from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Cliente } from 'src/app/models/cliente'
import { ApiClienteService } from 'src/app/services/api-cliente.service'

@Component({
    templateUrl: "dialogcliente.component.html"
}) 

export class DialogClienteComponent{

    public cedCli: string ='';
    public nomCli: string ='';
    public apeCli: string ='';
    public genCli: string ='';
    public telCli: string ='';
    public dirCli: string ='';

    constructor(
        public dialogRef: MatDialogRef<DialogClienteComponent>,
        public apiCliente: ApiClienteService,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public cliente:Cliente
    ){
        if(this.cliente !== null){
            this.cedCli = this.cliente.cedCli;
            this.nomCli = this.cliente.nomCli;
            this.apeCli = this.cliente.apeCli;
            this.genCli = this.cliente.genCli;
            this.telCli = this.cliente.telCli;
            this.dirCli = this.cliente.dirCli;
        }
    }

    close(){
        this.dialogRef.close();
    }

    editCliente(){
        const cliente: Cliente = {idCli: this.cliente.idCli,
                                  cedCli: this.cedCli, 
                                  nomCli: this.nomCli,
                                  apeCli: this.apeCli,
                                  genCli: this.genCli,
                                  telCli: this.telCli,
                                  dirCli: this.dirCli};
        this.apiCliente.editCliente(cliente).subscribe(response => {
            if(response.exito === 1){
                this.dialogRef.close();
                this.snackBar.open('Cliente Editado con éxito', '',{
                    duration: 2000
                });
            }
        })
    }

    addCliente(){
        const cliente: Cliente = {idCli: 0,
                                  cedCli: this.cedCli,
                                  nomCli: this.nomCli,
                                  apeCli: this.apeCli,
                                  genCli: this.genCli,
                                  telCli: this.telCli,
                                  dirCli: this.dirCli}
        this.apiCliente.addCliente(cliente).subscribe(response => {
            if(response.exito === 1){
                this.dialogRef.close();
                this.snackBar.open('Cliente Insertado con éxito', '',{
                    duration: 2000
                });
            }
        })
    }
}