import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { EvidenciaService } from '../../../services/evidencia';
import { EvidenciaReporte } from '../../../models/evidencia.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-evidencia-listar',
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
  templateUrl: './evidencia-listar.html',
  styleUrl: './evidencia-listar.scss',
})
export class EvidenciaListar implements OnInit {
  displayedColumns = ['id', 'rutaArchivo', 'reporteId', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<EvidenciaReporte>();

  constructor(
    private service: EvidenciaService,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {}

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
    if (!confirm(this.translate.instant('EVIDENCIA.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('EVIDENCIA.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });

        this.cargar();
      },

      error: (e) =>
        this.snack.open(
          this.translate.instant('EVIDENCIA.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        ),
    });
  }
}
