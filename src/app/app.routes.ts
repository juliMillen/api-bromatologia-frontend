import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroProductoComponent } from './components/registro-producto/registro-producto.component';
import { RegistroEstablecimientoComponent } from './components/registro-establecimiento/registro-establecimiento.component';
import { EmpresaComponent } from './components/empresa/empresa/empresa.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { EstablecimientoComponent } from './components/establecimiento/establecimiento.component';

export const routes: Routes = [
    {path: '', redirectTo:'/login', pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path:'loginRegister',component:LoginRegisterComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'empresa', component:EmpresaComponent},
    {path: 'registroProducto', component: RegistroProductoComponent},
    {path: 'registroEstablecimiento',component: RegistroEstablecimientoComponent},
    {path: 'registroEstablecimiento/:id',component: RegistroEstablecimientoComponent},
    {path: 'establecimiento',component: EstablecimientoComponent},
    {path: 'establecimiento/:id',component:EstablecimientoComponent},
    {path: 'mantenimiento',component: MantenimientoComponent},
    {path: 'mantenimiento/:id',component:MantenimientoComponent}
];
