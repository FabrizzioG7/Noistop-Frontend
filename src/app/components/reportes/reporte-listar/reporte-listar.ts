import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Reporte } from '../../../models/reporte.model';
import { ReporteService } from '../../../services/reporte';
import { MedicionService } from '../../../services/medicion';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reporte-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatBadgeModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './reporte-listar.html',
  styleUrl: './reporte-listar.scss',
})
export class ReporteListar implements OnInit {
  dataSource = new MatTableDataSource<Reporte>();
  decibelesPorMedicion: Record<number, number> = {};

  constructor(
    private service: ReporteService,
    private medicionService: MedicionService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

  esUser(): boolean {
    return this.auth.getRol() === 'USER';
  }

  puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY');
  }
  puedeEliminar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }

  get displayedColumns(): string[] {
    const base = [
      'id',
      'descripcion',
      'estado',
      'usuario',
      'categoria',
      'medicion',
      'distrito',
      'fecha',
    ];
    return this.puedeEditar() || this.puedeEliminar() ? [...base, 'acciones'] : base;
  }

  ngOnInit() {
    this.cargar();
    this.service.getList().subscribe((d) => (this.dataSource.data = d));
    this.medicionService.list().subscribe({
      next: (mediciones) => {
        this.decibelesPorMedicion = {};
        mediciones.forEach((m) => (this.decibelesPorMedicion[m.pkMedicionId] = m.decibeles));
      },
      error: () => (this.decibelesPorMedicion = {}),
    });
  }

  cargar() {
    if (this.esUser()) {
      const usuarioId = this.auth.getUsuarioId();
      if (!usuarioId) {
        this.dataSource.data = [];
        return;
      }
      this.service.historialPorUsuario(usuarioId).subscribe({
        next: (d) => (this.dataSource.data = d),
        error: () => (this.dataSource.data = []),
      });
      return;
    }

    this.service.list().subscribe({
      next: (d) => (this.dataSource.data = d),
      error: () => (this.dataSource.data = []),
    });
  }

  eliminar(id: number) {
    if (!confirm(this.translate.instant('REPORTE.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('REPORTE.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });
        this.cargar();
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('REPORTE.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          {
            duration: 4000,
          },
        ),
    });
  }

  estadoColor(estado: string): string {
    const map: Record<string, string> = {
      pendiente: '#f57c00',
      'en proceso': '#1565c0',
      resuelto: '#2e7d32',
      cerrado: '#546e7a',
    };
    return map[estado?.toLowerCase()] || '#757575';
  }

  decibelesDe(r: Reporte): number | null {
    if (!r.medicionId) return null;
    return this.decibelesPorMedicion[r.medicionId] ?? null;
  }
}
