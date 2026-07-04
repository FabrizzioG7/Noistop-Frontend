import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './categoria-listar.html',
  styleUrl: './categoria-listar.scss',
})
export class CategoriaListar implements OnInit {
  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>();

  constructor(
    private service: CategoriaService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {}

  puedeGestionar(): boolean {
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
    if (!confirm(this.translate.instant('CATEGORIA.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('CATEGORIA.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });

        this.cargar();
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('CATEGORIA.MENSAJES.ERROR_ELIMINAR') +
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
