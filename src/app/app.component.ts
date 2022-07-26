import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { ApiauthService } from './services/apiauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{

  title = 'appVentas';
  usuario!: Usuario;

  constructor(public apiauthService: ApiauthService, private router: Router){
    this.apiauthService.usuario.subscribe(res => {
      this.usuario = res;
      console.log('cambio el objeto: ' + res);
    })
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  logout(){
    this.apiauthService.logout();
    this.router.navigate(['/login']);
    let menu = document.getElementsByTagName("drawer.toogle()")
  }
}


