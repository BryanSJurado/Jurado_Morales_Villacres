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
        pass_Usu: ['', Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10),
            Validators.pattern(/^(?=.*\d)(?=.*[\u0021-\u002b\u002e\u003c-\u0040])(?=.*[A-Z]{2})(?=.*[a-z]{2})/)
          ])]
    })

    /*
     ['', Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10),
            Validators.pattern(/^(?=.*\d)(?=.*[\u0021-\u002b\u002e\u003c-\u0040])(?=.*[A-Z]{2})(?=.*[a-z]{2})/)
          ])]
    */
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