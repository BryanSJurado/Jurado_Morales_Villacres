import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DialogClienteComponent } from './cliente/Dialog/dialogcliente.component';
import * as jQuery from "jquery";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import { ClienteComponent } from './cliente/cliente.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogDeleteComponent } from './Common/Delete/dialogdelete.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './Security/jwt.interceptor';
import { VentaComponent } from './venta/venta.component';
import { DialogVentaComponent } from './venta/dialog/dialogventa.component';
import { ProductoComponent } from './producto/producto.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DialogDetalleVentaComponent } from './venta/DialogDetalle/dialogdetalleventa.component';
import { DataTablesModule } from 'angular-datatables';
import { DialogclienteComponent } from './venta/dialog/dialogcliente/dialogcliente.component';
import { DialogproductoComponent } from './venta/dialog/dialogproducto/dialogproducto.component';
import { UserComponent } from './user/user.component';

@NgModule({
  
  declarations: [
    AppComponent,
    HomeComponent,
    ClienteComponent,
    DialogClienteComponent,
    DialogDeleteComponent,
    LoginComponent,
    DialogVentaComponent,
    VentaComponent,
    ProductoComponent,
    DialogDetalleVentaComponent,
    DialogclienteComponent,
    DialogproductoComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,  
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    DatePipe, DecimalPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
