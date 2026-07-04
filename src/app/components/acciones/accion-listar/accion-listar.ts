import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AccionAdministrativa } from '../../../models/accion.model';
import { AccionService } from '../../../services/accion';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accion-listar',
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
  templateUrl: './accion-listar.html',
  styleUrl: './accion-listar.scss',
})
export class AccionListar implements OnInit {
  displayedColumns = ['id', 'detalle', 'reporte', 'usuario', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<AccionAdministrativa>();

  constructor(
    private service: AccionService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

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
    if (!confirm(this.translate.instant('ACCION.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('ACCION.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });
        this.cargar();
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('ACCION.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          {
            duration: 4000,
          },
        ),
    });
  }
}
