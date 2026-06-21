import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../../services/reporte';
import { Reporte } from '../../../models/reporte.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AccionAdministrativa } from '../../../models/accion.model';
import { AccionService } from '../../../services/accion';
import { UsuarioService } from '../../../services/usuario';
import { Usuario } from '../../../models/usuario.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accion-form',
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
    TranslateModule
  ],
  templateUrl: './accion-form.html',
  styleUrl: './accion-form.scss',
})
export class AccionForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;
  usuarios: Usuario[] = [];
  reportes: Reporte[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AccionService,
    private usuarioService: UsuarioService,
    private reporteService: ReporteService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      detalle: ['', Validators.required],
      usuarioId: [null, Validators.required],
      reporteId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.usuarioService.list().subscribe((d) => {
      this.usuarios = d.filter((u) => u.nombreRol === 'AUTHORITY');
    });
    this.reporteService.list().subscribe((d) => (this.reportes = d));
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) this.service.listId(this.id).subscribe((d) => this.form.patchValue(d));
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const a: AccionAdministrativa = this.form.value;
    const op = this.edicion ? this.service.update(this.id, a) : this.service.insert(a);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'ACCION.MENSAJES.ACTUALIZADO' : 'ACCION.MENSAJES.CREADO',
          ),
          'OK',
          {
            duration: 3000,
          },
        );
        this.router.navigate(['/acciones']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('ACCION.MENSAJES.ERROR_GENERAL') +
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
