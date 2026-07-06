import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
import { CategoriaService } from '../../services/categoria';
import { AuthService } from '../../services/auth';

interface EntityCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface HeroStat {
  icon: string;
  value: number;
  labelKey: string;
}

interface KpiCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  value: number;
  labelKey: string;
}

interface ActivityItem {
  id: number;
  title: string;
  subtitle: string;
  timeUnit: string;
  timeValue: number;
  timestamp: number;
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
  // Totales crudos (se llenan según lo que el rol pueda pedir al backend)
  totalReportes = 0;
  totalUbicaciones = 0;
  totalAcciones = 0;
  totalEvidencias = 0;
  totalUsuarios = 0;
  totalCategorias = 0;
  reportesHoy = 0;
  accionesActivas = 0;

  heroStats: HeroStat[] = [];
  kpis: KpiCard[] = [];
  entities: EntityCard[] = [];
  recentActivity: ActivityItem[] = [];
  actividadTituloKey = 'HOME.ACTIVIDAD_RECIENTE';
  loading = true;

  constructor(
    private router: Router,
    private reporteService: ReporteService,
    private ubicacionService: UbicacionService,
    private accionService: AccionService,
    private evidenciaService: EvidenciaService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    public auth: AuthService,
  ) {}

  esAdmin(): boolean {
    return this.auth.getRol() === 'ADMIN';
  }
  esStaff(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY');
  }
  esUser(): boolean {
    return this.auth.getRol() === 'USER';
  }

  ngOnInit() {
    this.entities = this.construirModulos();

    if (this.esStaff()) {
      this.cargarDashboardStaff();
    } else {
      this.cargarDashboardUsuario();
    }
  }

  // ===== ADMIN / AUTHORITY: dashboard con datos globales =====
  private cargarDashboardStaff() {
    const safe = (obs: any): any => obs.pipe(catchError(() => of([])));

    forkJoin({
      reportes: safe(this.reporteService.list()),
      ubicaciones: safe(this.ubicacionService.list()),
      acciones: safe(this.accionService.list()),
      evidencias: safe(this.evidenciaService.list()),
      usuarios: this.esAdmin() ? safe(this.usuarioService.list()) : of([]),
    }).subscribe({
      next: ({ reportes, ubicaciones, acciones, evidencias, usuarios }: any) => {
        this.totalReportes = reportes.length;
        this.totalUbicaciones = ubicaciones.length;
        this.totalAcciones = acciones.length;
        this.totalEvidencias = evidencias.length;
        this.totalUsuarios = usuarios.length;

        const hoy = new Date().toDateString();
        this.reportesHoy = reportes.filter(
          (r: any) => r.createdAt && new Date(r.createdAt).toDateString() === hoy,
        ).length;

        const hace7 = new Date();
        hace7.setDate(hace7.getDate() - 7);
        this.accionesActivas = acciones.filter(
          (a: any) => a.fechaAccion && new Date(a.fechaAccion) >= hace7,
        ).length;

        this.heroStats = this.esAdmin()
          ? [
              {
                icon: 'radio_button_checked',
                value: this.totalUsuarios,
                labelKey: 'HOME.STAT_USUARIOS',
              },
              { icon: 'report_problem', value: this.totalReportes, labelKey: 'HOME.STAT_REPORTES' },
              { icon: 'report', value: this.reportesHoy, labelKey: 'HOME.STAT_REPORTES_HOY' },
              { icon: 'gavel', value: this.accionesActivas, labelKey: 'HOME.STAT_ACCIONES' },
            ]
          : [
              { icon: 'report_problem', value: this.totalReportes, labelKey: 'HOME.STAT_REPORTES' },
              { icon: 'report', value: this.reportesHoy, labelKey: 'HOME.STAT_REPORTES_HOY' },
              { icon: 'gavel', value: this.accionesActivas, labelKey: 'HOME.STAT_ACCIONES' },
              {
                icon: 'location_on',
                value: this.totalUbicaciones,
                labelKey: 'HOME.STAT_UBICACIONES',
              },
            ];

        this.kpis = [
          {
            icon: 'report_problem',
            iconBg: '#fff0f0',
            iconColor: '#e53935',
            value: this.totalReportes,
            labelKey: 'HOME.KPI_REPORTES',
          },
          {
            icon: 'location_on',
            iconBg: '#f3e8ff',
            iconColor: '#7c3aed',
            value: this.totalUbicaciones,
            labelKey: 'HOME.KPI_UBICACIONES',
          },
          {
            icon: 'gavel',
            iconBg: '#fff7e6',
            iconColor: '#f59e0b',
            value: this.totalAcciones,
            labelKey: 'HOME.KPI_ACCIONES',
          },
          {
            icon: 'photo_library',
            iconBg: '#e0f2fe',
            iconColor: '#0284c7',
            value: this.totalEvidencias,
            labelKey: 'HOME.KPI_EVIDENCIAS',
          },
        ];

        this.actividadTituloKey = 'HOME.ACTIVIDAD_RECIENTE';
        this.recentActivity = this.construirActividadStaff(
          reportes,
          acciones,
          evidencias,
          ubicaciones,
          this.esAdmin() ? usuarios : [],
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // ===== USER: dashboard personal (solo lo que su rol puede ver) =====
  private cargarDashboardUsuario() {
    const usuarioId = this.auth.getUsuarioId();
    const safe = (obs: any): any => obs.pipe(catchError(() => of([])));

    forkJoin({
      misReportes: usuarioId ? safe(this.reporteService.historialPorUsuario(usuarioId)) : of([]),
      ubicaciones: safe(this.ubicacionService.list()),
      categorias: safe(this.categoriaService.list()),
    }).subscribe({
      next: ({ misReportes, ubicaciones, categorias }: any) => {
        this.totalReportes = misReportes.length;
        this.totalUbicaciones = ubicaciones.length;
        this.totalCategorias = categorias.length;

        const hoy = new Date().toDateString();
        this.reportesHoy = misReportes.filter(
          (r: any) => r.createdAt && new Date(r.createdAt).toDateString() === hoy,
        ).length;

        this.heroStats = [
          { icon: 'report_problem', value: this.totalReportes, labelKey: 'HOME.STAT_MIS_REPORTES' },
          { icon: 'report', value: this.reportesHoy, labelKey: 'HOME.STAT_MIS_REPORTES_HOY' },
          { icon: 'location_on', value: this.totalUbicaciones, labelKey: 'HOME.STAT_UBICACIONES' },
          { icon: 'category', value: this.totalCategorias, labelKey: 'HOME.STAT_CATEGORIAS' },
        ];

        this.kpis = [
          {
            icon: 'report_problem',
            iconBg: '#fff0f0',
            iconColor: '#e53935',
            value: this.totalReportes,
            labelKey: 'HOME.KPI_MIS_REPORTES',
          },
          {
            icon: 'location_on',
            iconBg: '#f3e8ff',
            iconColor: '#7c3aed',
            value: this.totalUbicaciones,
            labelKey: 'HOME.KPI_UBICACIONES',
          },
          {
            icon: 'category',
            iconBg: '#fff7e6',
            iconColor: '#f59e0b',
            value: this.totalCategorias,
            labelKey: 'HOME.KPI_CATEGORIAS',
          },
        ];

        this.actividadTituloKey = 'HOME.MI_ACTIVIDAD_RECIENTE';
        this.recentActivity = [...misReportes]
          .sort((a: any, b: any) => this.sortByDate(a.createdAt, b.createdAt))
          .slice(0, 5)
          .map((r: any) => ({
            id: r.pkReporteId,
            title: 'HOME.ACTIVIDAD.REPORTE_RUIDO',
            subtitle: r.descripcion?.slice(0, 45) || '',
            ...this.timeAgo(r.createdAt),
            timestamp: r.createdAt ? new Date(r.createdAt).getTime() : 0,
            icon: 'report_problem',
            color: '#e53935',
          }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private construirActividadStaff(
    reportes: any[],
    acciones: any[],
    evidencias: any[],
    ubicaciones: any[],
    usuarios: any[],
  ): ActivityItem[] {
    const items: ActivityItem[] = [];

    [...reportes]
      .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
      .slice(0, 2)
      .forEach((r) =>
        items.push({
          id: r.pkReporteId,
          title: 'HOME.ACTIVIDAD.REPORTE_RUIDO',
          subtitle: r.descripcion?.slice(0, 45) || '',
          ...this.timeAgo(r.createdAt),
          timestamp: r.createdAt ? new Date(r.createdAt).getTime() : 0,
          icon: 'report_problem',
          color: '#e53935',
        }),
      );

    [...acciones]
      .sort((a, b) => this.sortByDate(a.fechaAccion, b.fechaAccion))
      .slice(0, 2)
      .forEach((a) =>
        items.push({
          id: a.pkAccionId,
          title: 'HOME.ACTIVIDAD.ACCION_ADMIN',
          subtitle: a.detalle?.slice(0, 45) || '',
          ...this.timeAgo(a.fechaAccion),
          timestamp: a.fechaAccion ? new Date(a.fechaAccion).getTime() : 0,
          icon: 'gavel',
          color: '#0fa719',
        }),
      );

    [...evidencias]
      .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
      .slice(0, 1)
      .forEach((e) =>
        items.push({
          id: e.pkEvidenciaId,
          title: 'HOME.ACTIVIDAD.EVIDENCIA_SUBIDA',
          subtitle: e.nombreOriginal || e.rutaArchivo?.slice(0, 45) || '',
          ...this.timeAgo(e.createdAt),
          timestamp: e.createdAt ? new Date(e.createdAt).getTime() : 0,
          icon: 'photo_library',
          color: '#0284c7',
        }),
      );

    [...ubicaciones]
      .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
      .slice(0, 1)
      .forEach((u) =>
        items.push({
          id: u.pkUbicacionId,
          title: 'HOME.ACTIVIDAD.UBICACION_REGISTRADA',
          subtitle: `${u.ubicacion}, ${u.distrito}`,
          ...this.timeAgo(u.createdAt),
          timestamp: u.createdAt ? new Date(u.createdAt).getTime() : 0,
          icon: 'location_on',
          color: '#7c3aed',
        }),
      );

    [...usuarios]
      .sort((a, b) => this.sortByDate(a.createdAt, b.createdAt))
      .slice(0, 1)
      .forEach((u) =>
        items.push({
          id: u.pkUsuarioId,
          title: 'HOME.ACTIVIDAD.USUARIO_REGISTRADO',
          subtitle: `${u.nombre} — ${u.nombreRol || ''}`,
          ...this.timeAgo(u.createdAt),
          timestamp: u.createdAt ? new Date(u.createdAt).getTime() : 0,
          icon: 'person_add',
          color: '#f59e0b',
        }),
      );

    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }

  // Tarjetas de "Módulos": distintas según lo que el rol pueda gestionar
  private construirModulos(): EntityCard[] {
    if (this.esAdmin()) {
      return [
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
          title: 'HOME.CARDS.MEDICIONES.TITLE',
          description: 'HOME.CARDS.MEDICIONES.DESCRIPTION',
          icon: 'graphic_eq',
          route: '/mediciones',
          color: '#009688',
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
    }

    if (this.esStaff()) {
      // AUTHORITY: todo el trabajo de campo/gestión, sin Usuarios ni Roles
      return [
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
          title: 'HOME.CARDS.MEDICIONES.TITLE',
          description: 'HOME.CARDS.MEDICIONES.DESCRIPTION',
          icon: 'graphic_eq',
          route: '/mediciones',
          color: '#009688',
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
    }

    // USER: catálogos de referencia + acciones rápidas de ciudadano
    return [
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
        title: 'HOME.CARDS.REPORTAR.TITLE',
        description: 'HOME.CARDS.REPORTAR.DESCRIPTION',
        icon: 'report_problem',
        route: '/reportes/nuevo',
        color: '#e53935',
      },
      {
        title: 'HOME.CARDS.MEDICIONES.TITLE',
        description: 'HOME.CARDS.MEDICIONES.DESCRIPTION',
        icon: 'graphic_eq',
        route: '/mediciones',
        color: '#009688',
      },
      {
        title: 'HOME.CARDS.SUBIR_EVIDENCIA.TITLE',
        description: 'HOME.CARDS.SUBIR_EVIDENCIA.DESCRIPTION',
        icon: 'photo_library',
        route: '/evidencias/nuevo',
        color: '#0284c7',
      },
    ];
  }

  private sortByDate(a?: string, b?: string): number {
    return new Date(b || 0).getTime() - new Date(a || 0).getTime();
  }

  timeAgo(dateStr?: string): { timeUnit: string; timeValue: number } {
    if (!dateStr) return { timeUnit: '', timeValue: 0 };
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return { timeUnit: 'HACE_SEGUNDOS', timeValue: diff };
    if (diff < 3600) return { timeUnit: 'HACE_MINUTOS', timeValue: Math.floor(diff / 60) };
    if (diff < 86400) return { timeUnit: 'HACE_HORAS', timeValue: Math.floor(diff / 3600) };
    return { timeUnit: 'HACE_DIAS', timeValue: Math.floor(diff / 86400) };
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
