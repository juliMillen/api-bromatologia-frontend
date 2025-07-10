import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroProductoComponent } from './components/registro-producto/registro-producto.component';
import { RegistroEstablecimientoComponent } from './components/registro-establecimiento/registro-establecimiento.component';
import { RegistroProductoEstablecimientoComponent } from './components/registroProductoEstablecimiento/registro-producto-establecimiento/registro-producto-establecimiento.component';
import { EmpresaComponent } from './components/empresa/empresa/empresa.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { EstablecimientoComponent } from './components/establecimiento/establecimiento.component';

export const routes: Routes = [
    {path: '', redirectTo:'/login', pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path:'login-register',component:LoginRegisterComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'empresa', component:EmpresaComponent},
    {path: 'registro-producto', component: RegistroProductoComponent},
    {path: 'registro-establecimiento',component: RegistroEstablecimientoComponent},
    {path: 'registro-producto-establecimiento', component:RegistroProductoEstablecimientoComponent},

    //path de prueba
    {path: 'establecimiento',component: EstablecimientoComponent},
    {path: 'mantenimiento',component: MantenimientoComponent}
];
