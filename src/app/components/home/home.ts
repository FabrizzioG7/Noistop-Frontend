import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ReporteService } from '../../services/reporte';
import { UbicacionService } from '../../services/ubicacion';
import { AccionService } from '../../services/accion';
import { EvidenciaService } from '../../services/evidencia';
import { UsuarioService } from '../../services/usuario';

interface EntityCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface ActivityItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  totalReportes = 0;
  totalUbicaciones = 0;
  totalAcciones = 0;
  totalEvidencias = 0;
  totalUsuarios = 0;

  reportesHoy = 0;
  accionesActivas = 0;

  recentActivity: ActivityItem[] = [];
  loading = true;

  entities: EntityCard[] = [
    {
      title: 'HOME.CARDS.USUARIOS.TITLE',
      description: 'HOME.CARDS.USUARIOS.DESCRIPTION',
      icon: 'people',
      route: '/usuarios',
      color: '#0fa719',
    },
    {
      title: 'HOME.CARDS.ROLES.TITLE',
      description: 'HOME.CARDS.ROLES.DESCRIPTION',
      icon: 'security',
      route: '/roles',
      color: '#1565C0',
    },
    {
      title: 'HOME.CARDS.UBICACIONES.TITLE',
      description: 'HOME.CARDS.UBICACIONES.DESCRIPTION',
      icon: 'location_on',
      route: '/ubicaciones',
      color: '#7c3aed',
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
      color: '#e53935',
    },
    {
      title: 'HOME.CARDS.ACCIONES.TITLE',
      description: 'HOME.CARDS.ACCIONES.DESCRIPTION',
      icon: 'gavel',
      route: '/acciones',
      color: '#0fa719',
    },
    {
      title: 'HOME.CARDS.EVIDENCIAS.TITLE',
      description: 'HOME.CARDS.EVIDENCIAS.DESCRIPTION',
      icon: 'photo_library',
      route: '/evidencias',
      color: '#0284c7',
    },
  ];

  constructor(
    private router: Router,
    private reporteService: ReporteService,
    private ubicacionService: UbicacionService,
    private accionService: AccionService,
    private evidenciaService: EvidenciaService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    forkJoin({
      reportes: this.reporteService.list(),
      ubicaciones: this.ubicacionService.list(),
      acciones: this.accionService.list(),
      evidencias: this.evidenciaService.list(),
      usuarios: this.usuarioService.list(),
    }).subscribe({
      next: ({ reportes, ubicaciones, acciones, evidencias, usuarios }) => {
        this.totalReportes = reportes.length;
        this.totalUbicaciones = ubicaciones.length;
        this.totalAcciones = acciones.length;
        this.totalEvidencias = evidencias.length;
        this.totalUsuarios = usuarios.length;

        // Reportes de hoy
        const hoy = new Date().toDateString();
        this.reportesHoy = reportes.filter(
          (r) => r.createdAt && new Date(r.createdAt).toDateString() === hoy,
        ).length;

        // Acciones activas (últimos 7 días)
        const hace7 = new Date();
        hace7.setDate(hace7.getDate() - 7);
        this.accionesActivas = acciones.filter(
          (a) => a.fechaAccion && new Date(a.fechaAccion) >= hace7,
        ).length;

        // Actividad reciente: mezclar últimos registros de reportes, acciones, evidencias, ubicaciones, usuarios
        const items: ActivityItem[] = [];

        const sortedReportes = [...reportes]
          .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
          .slice(0, 2);
        sortedReportes.forEach((r) =>
          items.push({
            id: r.pkReporteId,
            title: 'Reporte de ruido',
            subtitle: r.descripcion?.slice(0, 45) || '',
            time: this.timeAgo(r.createdAt),
            icon: 'report_problem',
            color: '#e53935',
          }),
        );

        const sortedAcciones = [...acciones]
          .sort((a, b) => this.sortByDate(a.fechaAccion, b.fechaAccion))
          .slice(0, 2);
        sortedAcciones.forEach((a) =>
          items.push({
            id: a.pkAccionId,
            title: 'Acción administrativa',
            subtitle: a.detalle?.slice(0, 45) || '',
            time: this.timeAgo(a.fechaAccion),
            icon: 'gavel',
            color: '#0fa719',
          }),
        );

        const sortedEvidencias = [...evidencias]
          .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
          .slice(0, 1);
        sortedEvidencias.forEach((e) =>
          items.push({
            id: e.pkEvidenciaId,
            title: 'Nueva evidencia subida',
            subtitle: e.rutaArchivo?.slice(0, 45) || '',
            time: this.timeAgo(e.createdAt),
            icon: 'photo_library',
            color: '#0284c7',
          }),
        );

        const sortedUbicaciones = [...ubicaciones]
          .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
          .slice(0, 1);
        sortedUbicaciones.forEach((u) =>
          items.push({
            id: u.pkUbicacionId,
            title: 'Ubicación registrada',
            subtitle: `${u.ubicacion}, ${u.distrito}`,
            time: this.timeAgo(u.createdAt),
            icon: 'location_on',
            color: '#7c3aed',
          }),
        );

        const sortedUsuarios = [...usuarios]
          .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
          .slice(0, 1);
        sortedUsuarios.forEach((u) =>
          items.push({
            id: u.pkUsuarioId,
            title: 'Usuario registrado',
            subtitle: `${u.nombre} — ${u.nombreRol || ''}`,
            time: this.timeAgo(u.createdAt),
            icon: 'person_add',
            color: '#f59e0b',
          }),
        );
        this.recentActivity = items.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private sortByDate(a?: string, b?: string): number {
    return new Date(b || 0).getTime() - new Date(a || 0).getTime();
  }

  timeAgo(dateStr?: string): string {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `Hace ${diff}s`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
