import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistroProductoComponent } from "./components/registro-producto/registro-producto.component";
import { RegistroEstablecimientoComponent } from "./components/registro-establecimiento/registro-establecimiento.component";
import { RegistroProductoEstablecimientoComponent } from "./components/registroProductoEstablecimiento/registro-producto-establecimiento/registro-producto-establecimiento.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegistroProductoComponent, RegistroEstablecimientoComponent, RegistroProductoEstablecimientoComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'registros-frontend';
}
