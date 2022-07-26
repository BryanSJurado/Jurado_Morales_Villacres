import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiauthService } from "../services/apiauth.service";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']})
export class LoginComponent implements OnInit{

    public loginForm = this.fb.group({
        email_Usu: ['', Validators.required],
        pass_Usu: ['', Validators.required]
    })

    constructor(public apiauthService: ApiauthService, 
                private router:Router,
                private fb: FormBuilder){
        /*if(this.apiauthService.usuarioData){
            this.router.navigate(['/']);
        }*/
    }
    ngOnInit(){
         
    }

    login(){
        //
        this.apiauthService.login(this.loginForm.value).subscribe(response =>{
            if(response.exito === 1){
                this.router.navigate(['/']);
            }
        });
    }
}