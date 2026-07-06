import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicionService } from '../../../services/medicion';
import { Medicion } from '../../../models/medicion.model';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-medicion-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './medicion-form.html',
  styleUrl: './medicion-form.scss',
})
export class MedicionForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;

  constructor(
    private fb: FormBuilder,
    private service: MedicionService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {
    this.form = this.fb.group({
      decibeles: [null, [Validators.required, Validators.min(0), Validators.max(200)]],
      fechaHora: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) {
        this.service.listId(this.id).subscribe((d) =>
          this.form.patchValue({
            decibeles: d.decibeles,
            fechaHora: this.aDatetimeLocal(d.fechaHora),
          }),
        );
      }
    });
  }

  // Convierte una fecha ISO (backend) al formato que exige el input
  // datetime-local: "yyyy-MM-ddTHH:mm".
  private aDatetimeLocal(iso?: string): string {
    if (!iso) return '';
    return iso.slice(0, 16);
  }

  guardar() {
    if (this.form.invalid) return;
    const m: Medicion = this.form.value;
    const op = this.edicion ? this.service.update(this.id, m) : this.service.insert(m);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'MEDICION.MENSAJES.ACTUALIZADO' : 'MEDICION.MENSAJES.CREADO',
          ),
          'OK',
          {
            duration: 3000,
          },
        );
        this.router.navigate(['/mediciones']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('MEDICION.MENSAJES.ERROR_GENERAL') +
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
