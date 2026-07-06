import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Rol } from '../../../models/rol.model';
import { RolService } from '../../../services/rol';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rol-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './rol-form.html',
  styleUrl: './rol-form.scss',
})
export class RolForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({ nombreRol: ['', [Validators.required]] });
  }

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) {
        this.rolService.listId(this.id).subscribe((d) => this.form.patchValue(d));
      }
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const rol: Rol = this.form.value;
    const op = this.edicion ? this.rolService.update(this.id, rol) : this.rolService.insert(rol);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(this.edicion ? 'ROL.MENSAJES.ACTUALIZADO' : 'ROL.MENSAJES.CREADO'),
          'OK',
          { duration: 3000 },
        );
        this.router.navigate(['/roles']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('ROL.MENSAJES.ERROR_GENERAL') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        ),
    });
  }
}
