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
  displayedColumns = [
    'id',
    'descripcion',
    'estado',
    'usuario',
    'categoria',
    'distrito',
    'fecha',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Reporte>();

  constructor(
    private service: ReporteService,
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
}
