import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Rol } from '../../models/rol.model';
import { Usuario } from '../../models/usuario.model';
import { RolService } from '../../services/rol';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {
  form: FormGroup;
  roles: Rol[] = [];
  ocultarPassword = signal(true);
  cargando = signal(false);

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router,
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
    this.rolService.listPublico().subscribe({
      next: (r) => (this.roles = r),
      error: () => (this.roles = []),
    });
  }

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.ocultarPassword.set(!this.ocultarPassword());
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    const usuario: Usuario = { ...this.form.value, pkUsuarioId: 0 };

    this.usuarioService.registrar(usuario).subscribe({
      next: () => {
        this.cargando.set(false);
        this.snack.open(this.translate.instant('REGISTRO.MENSAJES.CREADO'), 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.cargando.set(false);
        this.snack.open(
          this.translate.instant('REGISTRO.MENSAJES.ERROR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        );
      },
    });
  }
}
