import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroProductoComponent } from './components/registro-producto/registro-producto.component';
import { RegistroEstablecimientoComponent } from './components/registro-establecimiento/registro-establecimiento.component';
import { RegistroProductoEstablecimientoComponent } from './components/registroProductoEstablecimiento/registro-producto-establecimiento/registro-producto-establecimiento.component';
import { EmpresaComponent } from './components/empresa/empresa/empresa.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ModalEstablecimientoComponent } from './components/modal-establecimiento/modal-establecimiento.component';
import { ModalProductoComponent } from './components/modal-producto/modal-producto.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path:'login-register',component:LoginRegisterComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'empresa', component:EmpresaComponent},
    {path: 'registro-producto', component: RegistroProductoComponent},
    {path: 'registro-establecimiento',component: RegistroEstablecimientoComponent},
    {path: 'registro-producto-establecimiento', component:RegistroProductoEstablecimientoComponent},

    //path de prueba
    {path: 'modal-establecimiento',component: ModalEstablecimientoComponent},
    {path: 'modal-producto',component: ModalProductoComponent},
    {path: 'mantenimiento',component: MantenimientoComponent}
];
