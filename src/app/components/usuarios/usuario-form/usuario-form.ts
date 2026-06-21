import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Rol } from '../../../models/rol.model';
import { UsuarioService } from '../../../services/usuario';
import { RolService } from '../../../services/rol';
import { Usuario } from '../../../models/usuario.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rolId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.rolService.list().subscribe((r) => (this.roles = r));
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) {
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.usuarioService
          .listId(this.id)
          .subscribe((d) =>
            this.form.patchValue({ nombre: d.nombre, email: d.email, rolId: d.rolId }),
          );
      }
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const usuario: Usuario = { ...this.form.value, pkUsuarioId: this.id };
    const op = this.edicion
      ? this.usuarioService.update(this.id, usuario)
      : this.usuarioService.insert(usuario);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'USUARIO.MENSAJES.ACTUALIZADO' : 'USUARIO.MENSAJES.CREADO',
          ),
          'OK',
          {
            duration: 3000,
          },
        );

        this.router.navigate(['/usuarios']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('USUARIO.MENSAJES.ERROR_GENERAL') +
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
