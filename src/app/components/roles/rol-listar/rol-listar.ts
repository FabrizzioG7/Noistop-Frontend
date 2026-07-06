import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Rol } from '../../../models/rol.model';
import { RolService } from '../../../services/rol';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rol-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './rol-listar.html',
  styleUrl: './rol-listar.scss',
})
export class RolListar implements OnInit {
  displayedColumns = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Rol>();

  constructor(
    private rolService: RolService,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.cargar();
    this.rolService.getList().subscribe((data) => (this.dataSource.data = data));
  }

  cargar() {
    this.rolService.list().subscribe({
      next: (d) => (this.dataSource.data = d),
      error: () => (this.dataSource.data = []),
    });
  }

  eliminar(id: number) {
    if (!confirm(this.translate.instant('ROL.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.rolService.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('ROL.MENSAJES.ELIMINADO'), 'OK', { duration: 3000 });
        this.cargar();
      },
      error: () =>
        this.snack.open(this.translate.instant('ROL.MENSAJES.ERROR_ELIMINAR'), 'OK', {
          duration: 3000,
        }),
    });
  }
}
