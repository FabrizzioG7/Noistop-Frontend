import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { Ubicacion } from '../../../models/ubicacion.model';
import { Medicion } from '../../../models/medicion.model';
import { ReporteService } from '../../../services/reporte';
import { CategoriaService } from '../../../services/categoria';
import { UbicacionService } from '../../../services/ubicacion';
import { MedicionService } from '../../../services/medicion';
import { AuthService } from '../../../services/auth';
import { Reporte } from '../../../models/reporte.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reporte-form',
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
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './reporte-form.html',
  styleUrl: './reporte-form.scss',
})
export class ReporteForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;
  categorias: Categoria[] = [];
  ubicaciones: Ubicacion[] = [];
  mediciones: Medicion[] = [];
  estados = ['pendiente', 'en proceso', 'resuelto', 'cerrado'];

  constructor(
    private fb: FormBuilder,
    private service: ReporteService,
    private categoriaService: CategoriaService,
    private ubicacionService: UbicacionService,
    private medicionService: MedicionService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      // Se autocompleta con el usuario logueado; no se elige manualmente.
      usuarioId: [this.auth.getUsuarioId(), Validators.required],
      medicionId: [null],
      categoriaId: [null, Validators.required],
      ubicacionId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.categoriaService.list().subscribe((d) => (this.categorias = d));
    this.ubicacionService.list().subscribe((d) => (this.ubicaciones = d));
    this.medicionService.list().subscribe({
      next: (d) => (this.mediciones = d),
      error: () => (this.mediciones = []),
    });
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      // En edición se conserva el usuario original del reporte (no se
      // reasigna al usuario que está editando).
      if (this.edicion) this.service.listId(this.id).subscribe((d) => this.form.patchValue(d));
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const r: Reporte = this.form.value;
    const op = this.edicion ? this.service.update(this.id, r) : this.service.insert(r);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'REPORTE.MENSAJES.ACTUALIZADO' : 'REPORTE.MENSAJES.CREADO',
          ),
          'OK',
          {
            duration: 3000,
          },
        );
        this.router.navigate(['/reportes']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('REPORTE.MENSAJES.ERROR_GENERAL') +
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
