import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  constructor(private translate: TranslateService) {
    const idiomaGuardado = localStorage.getItem('idioma') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(idiomaGuardado);
  }

  cambiarIdioma(idioma: string) {
    this.translate.use(idioma);
    localStorage.setItem('idioma', idioma);
  }

  checkCloseMenu(trigger: any, panel: any) {
    // pequeño delay para que el mouse pueda pasar al panel sin que se cierre
    setTimeout(() => {
      if (!panel._isAnimating) {
        trigger.closeMenu();
      }
    }, 100);
  }
}
