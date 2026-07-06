import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth';
import { WelcomeDialog } from '../welcome-dialog/welcome-dialog';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    TranslateModule,
    MatMenuModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form: FormGroup;
  ocultarPassword = signal(true);
  cargando = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      identificador: ['', Validators.required],
      password: ['', Validators.required],
    });

    const idioma = localStorage.getItem('idioma') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(idioma);
  }

  cambiarIdioma(idioma: string) {
    this.translate.use(idioma);
    localStorage.setItem('idioma', idioma);
  }

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.ocultarPassword.set(!this.ocultarPassword());
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.cargando.set(true);

    this.authService.login(this.form.value).subscribe({
      next: (resp) => {
        this.cargando.set(false);

        const dialogRef = this.dialog.open(WelcomeDialog, {
          data: { nombre: resp.nombre },
          panelClass: 'welcome-dialog-panel',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/home']);
        });
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(e.error?.message || 'Usuario/correo o contraseña incorrectos.');
      },
    });
  }
}
