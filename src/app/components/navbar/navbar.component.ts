import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [ RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone:true
})
export class NavbarComponent {

  constructor(private router:Router, private authService: AuthService){}

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    //limpiar el token
    localStorage.removeItem('token');

    //redirigo a la pagina de login
    this.router.navigate(['/login']);
  }

    isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }


  @HostListener('document:click',['$event'])onDocumentClick($event:MouseEvent){
    const sidebar = document.querySelector('.sidebar');
    const togleButton = document.querySelector('.toggle-btn');

    if(sidebar && togleButton){
      const clickedInsideSidebar = sidebar.contains(event?.target as Node);
      const clickedToggleButton = togleButton.contains(event?.target as Node);

      if(!this.isCollapsed && !clickedInsideSidebar && !clickedToggleButton){
        this.isCollapsed = true;
      }
    }
  }
}
