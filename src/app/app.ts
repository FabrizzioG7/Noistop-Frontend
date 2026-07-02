import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MenuComponent } from './components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('noistop-frontend');

  // El menú no debe mostrarse en las pantallas públicas de login/registro
  private rutasSinMenu = ['/login', '/registro'];
  mostrarMenu = signal(true);

  constructor(private router: Router) {
    this.mostrarMenu.set(!this.rutasSinMenu.includes(this.router.url));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.mostrarMenu.set(!this.rutasSinMenu.includes(e.urlAfterRedirects.split('?')[0]));
      });
  }
}
