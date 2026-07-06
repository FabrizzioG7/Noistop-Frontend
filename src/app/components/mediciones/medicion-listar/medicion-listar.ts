import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Medicion } from '../../../models/medicion.model';
import { MedicionService } from '../../../services/medicion';
import { ReporteService } from '../../../services/reporte';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-medicion-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './medicion-listar.html',
  styleUrl: './medicion-listar.scss',
})
export class MedicionListar implements OnInit {
  dataSource = new MatTableDataSource<Medicion>();

  constructor(
    private service: MedicionService,
    private reporteService: ReporteService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

  esUser(): boolean {
    return this.auth.getRol() === 'USER';
  }

  // Registrar/editar mediciones: ADMIN y AUTHORITY (igual que en el backend).
  puedeGestionar(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY');
  }
  // Eliminar: solo ADMIN.
  puedeEliminar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }

  get displayedColumns(): string[] {
    const base = ['id', 'decibeles', 'fechaHora', 'createdAt'];
    return this.puedeGestionar() || this.puedeEliminar() ? [...base, 'acciones'] : base;
  }

  ngOnInit() {
    this.cargar();
    this.service.getList().subscribe((d) => (this.dataSource.data = d));
  }

  cargar() {
    // El registro de "Medicion" no guarda directamente quién la creó, así
    // que para USER se calcula el conjunto de mediciones asociadas a "sus"
    // propios reportes (igual criterio de aislamiento que en Reportes) y se
    // filtra el listado general a solo esas. ADMIN/AUTHORITY ven todas.
    if (this.esUser()) {
      const usuarioId = this.auth.getUsuarioId();
      if (!usuarioId) {
        this.dataSource.data = [];
        return;
      }
      this.reporteService.historialPorUsuario(usuarioId).subscribe({
        next: (reportes) => {
          const idsPropios = new Set(
            reportes.map((r) => r.medicionId).filter((id): id is number => !!id),
          );
          this.service.list().subscribe({
            next: (mediciones) =>
              (this.dataSource.data = mediciones.filter((m) => idsPropios.has(m.pkMedicionId))),
            error: () => (this.dataSource.data = []),
          });
        },
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
    if (!confirm(this.translate.instant('MEDICION.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('MEDICION.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });
        this.cargar();
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('MEDICION.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          {
            duration: 4000,
          },
        ),
    });
  }

  nivelColor(decibeles: number): string {
    if (decibeles >= 85) return '#c62828';
    if (decibeles >= 65) return '#ef6c00';
    return '#2e7d32';
  }

  nivelTexto(decibeles: number): string {
    if (decibeles >= 85) return this.translate.instant('MEDICION.NIVEL.ALTO');
    if (decibeles >= 65) return this.translate.instant('MEDICION.NIVEL.MODERADO');
    return this.translate.instant('MEDICION.NIVEL.BAJO');
  }
}
