import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent {
  usuario;
  rol;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.usuario = this.authService.usuario;
    this.rol = this.authService.rol;

    const idiomaGuardado = localStorage.getItem('idioma') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(idiomaGuardado);
  }

  cambiarIdioma(idioma: string) {
    this.translate.use(idioma);
    localStorage.setItem('idioma', idioma);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  esAdmin(): boolean {
    return this.rol() === 'ADMIN';
  }

  esStaff(): boolean {
    return this.rol() === 'ADMIN' || this.rol() === 'AUTHORITY';
  }

  esUser(): boolean {
    return this.rol() === 'USER';
  }

  checkCloseMenu(trigger: any, panel: any) {
    setTimeout(() => {
      if (!panel._isAnimating) {
        trigger.closeMenu();
      }
    }, 100);
  }
}
