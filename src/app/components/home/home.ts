import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface EntityCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  count?: string;
}

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  entities: EntityCard[] = [
    {
      title: 'HOME.CARDS.ROLES.TITLE',
      description: 'HOME.CARDS.ROLES.DESCRIPTION',
      icon: 'security',
      route: '/roles',
      color: '#1565C0',
    },
    {
      title: 'HOME.CARDS.USUARIOS.TITLE',
      description: 'HOME.CARDS.USUARIOS.DESCRIPTION',
      icon: 'people',
      route: '/usuarios',
      color: '#2E7D32',
    },
    {
      title: 'HOME.CARDS.UBICACIONES.TITLE',
      description: 'HOME.CARDS.UBICACIONES.DESCRIPTION',
      icon: 'location_on',
      route: '/ubicaciones',
      color: '#6A1B9A',
    },
    {
      title: 'HOME.CARDS.CATEGORIAS.TITLE',
      description: 'HOME.CARDS.CATEGORIAS.DESCRIPTION',
      icon: 'category',
      route: '/categorias',
      color: '#E65100',
    },
    {
      title: 'HOME.CARDS.REPORTES.TITLE',
      description: 'HOME.CARDS.REPORTES.DESCRIPTION',
      icon: 'report_problem',
      route: '/reportes',
      color: '#B71C1C',
    },
    {
      title: 'HOME.CARDS.ACCIONES.TITLE',
      description: 'HOME.CARDS.ACCIONES.DESCRIPTION',
      icon: 'gavel',
      route: '/acciones',
      color: '#004D40',
    },
    {
      title: 'HOME.CARDS.EVIDENCIAS.TITLE',
      description: 'HOME.CARDS.EVIDENCIAS.DESCRIPTION',
      icon: 'photo_library',
      route: '/evidencias',
      color: '#477186',
    },
  ];

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
