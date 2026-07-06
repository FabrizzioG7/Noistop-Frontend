import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario';
import { Usuario } from '../../../models/usuario.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-usuario-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    TranslateModule,
  ],
  templateUrl: './usuario-listar.html',
  styleUrl: './usuario-listar.scss',
})
export class UsuarioListar implements OnInit {
  displayedColumns = ['id', 'nombre', 'email', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>();

  constructor(
    private usuarioService: UsuarioService,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.cargar();
    this.usuarioService.getList().subscribe((data) => (this.dataSource.data = data));
  }

  cargar() {
    this.usuarioService.list().subscribe({
      next: (d) => (this.dataSource.data = d),
      error: () => (this.dataSource.data = []),
    });
  }

  eliminar(id: number) {
    if (!confirm(this.translate.instant('USUARIO.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }
    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('USUARIO.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });
        this.cargar();
      },
      error: () =>
        this.snack.open(this.translate.instant('USUARIO.MENSAJES.ERROR_ELIMINAR'), 'OK', {
          duration: 3000,
        }),
    });
  }
}
