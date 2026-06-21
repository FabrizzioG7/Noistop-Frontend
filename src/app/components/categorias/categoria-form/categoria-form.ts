import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Categoria } from '../../../models/categoria.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-form',
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
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
})
export class CategoriaForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;

  constructor(
    private fb: FormBuilder,
    private service: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      nombreCategoria: ['', Validators.required],
      descripcionCategoria: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) this.service.listId(this.id).subscribe((d) => this.form.patchValue(d));
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const c: Categoria = this.form.value;
    const op = this.edicion ? this.service.update(this.id, c) : this.service.insert(c);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'CATEGORIA.MENSAJES.ACTUALIZADO' : 'CATEGORIA.MENSAJES.CREADO',
          ),
          'OK',
          {
            duration: 3000,
          },
        );
        this.router.navigate(['/categorias']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('CATEGORIA.MENSAJES.ERROR_GENERAL') +
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
