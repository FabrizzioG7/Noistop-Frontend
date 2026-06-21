import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Reporte } from '../../../models/reporte.model';
import { EvidenciaService } from '../../../services/evidencia';
import { ReporteService } from '../../../services/reporte';
import { EvidenciaReporte } from '../../../models/evidencia.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-evidencia-form',
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
  templateUrl: './evidencia-form.html',
  styleUrl: './evidencia-form.scss',
})
export class EvidenciaForm implements OnInit {
  form: FormGroup;
  reportes: Reporte[] = [];
  selectedFileName = '';
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private service: EvidenciaService,
    private reporteService: ReporteService,
    private router: Router,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      rutaArchivo: ['', Validators.required],
      reporteId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.reporteService.list().subscribe((d) => (this.reportes = d));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFileName = file.name;
    this.form.patchValue({
      rutaArchivo: '/uploads/' + file.name,
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  guardar() {
    if (this.form.invalid) return;
    const e: EvidenciaReporte = this.form.value;
    this.service.insert(e).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('EVIDENCIA.MENSAJES.CREADO'), 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/evidencias']);
      },
      error: (err) => {
        this.snack.open(
          this.translate.instant('EVIDENCIA.MENSAJES.ERROR_GENERAL') +
            ': ' +
            (err.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        );
      },
    });
  }
}
