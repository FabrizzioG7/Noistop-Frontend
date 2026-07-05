import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Ubicacion } from '../../../models/ubicacion.model';
import { UbicacionService } from '../../../services/ubicacion';
import { ReporteService } from '../../../services/reporte';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubicacion-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './ubicacion-listar.html',
  styleUrl: './ubicacion-listar.scss',
})
export class UbicacionListar implements OnInit {
  dataSource = new MatTableDataSource<Ubicacion>();

  constructor(
    private service: UbicacionService,
    private reporteService: ReporteService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

  // Crear ubicaciones: los 3 roles (USER indica el lugar exacto de su reporte).
  puedeCrear(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY', 'USER');
  }
  // Editar: ADMIN y AUTHORITY. Eliminar: solo ADMIN.
  puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY');
  }
  puedeEliminar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }

  get displayedColumns(): string[] {
    const base = ['id', 'ubicacion', 'distrito', 'latitud', 'longitud'];
    return this.puedeEditar() || this.puedeEliminar() ? [...base, 'acciones'] : base;
  }

  ngOnInit() {
    this.cargar();
    this.service.getList().subscribe((d) => (this.dataSource.data = d));
  }

  cargar() {
    this.service.list().subscribe({
      next: (todas) => {
        // USER: solo ve "sus" ubicaciones (las que usó en sus propios reportes).
        // Las ubicaciones no tienen dueño en la BD, así que se calculan
        // cruzando con el historial de reportes del usuario logueado.
        if (this.auth.getRol() === 'USER') {
          const usuarioId = this.auth.getUsuarioId();
          if (!usuarioId) {
            this.dataSource.data = [];
            return;
          }
          this.reporteService.historialPorUsuario(usuarioId).subscribe({
            next: (misReportes) => {
              const idsUsados = new Set(misReportes.map((r) => r.ubicacionId));
              this.dataSource.data = todas.filter((u) => idsUsados.has(u.pkUbicacionId));
            },
            error: () => (this.dataSource.data = []),
          });
        } else {
          this.dataSource.data = todas;
        }
      },
      error: () => (this.dataSource.data = []),
    });
  }

  eliminar(id: number) {
    if (!confirm(this.translate.instant('UBICACION.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('UBICACION.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });
        this.cargar();
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('UBICACION.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        ),
    });
  }
}
