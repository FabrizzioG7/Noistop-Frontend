import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Ubicacion } from '../../../models/ubicacion.model';
import { UbicacionService } from '../../../services/ubicacion';
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
  displayedColumns = ['id', 'ubicacion', 'distrito', 'latitud', 'longitud', 'acciones'];
  dataSource = new MatTableDataSource<Ubicacion>();

  constructor(
    private service: UbicacionService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

  // Crear/editar ubicaciones: ADMIN y AUTHORITY. Eliminar: solo ADMIN.
  puedeGestionar(): boolean {
    return this.auth.tieneRol('ADMIN', 'AUTHORITY');
  }
  puedeEliminar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }

  ngOnInit() {
    this.cargar();
    this.service.getList().subscribe((d) => (this.dataSource.data = d));
  }

  cargar() {
    this.service.list().subscribe({
      next: (d) => (this.dataSource.data = d),
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
