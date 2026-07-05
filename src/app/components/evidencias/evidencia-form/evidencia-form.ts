import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Reporte } from '../../../models/reporte.model';
import { EvidenciaService } from '../../../services/evidencia';
import { ReporteService } from '../../../services/reporte';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5MB

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
    MatProgressSpinnerModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './evidencia-form.html',
  styleUrl: './evidencia-form.scss',
})
export class EvidenciaForm implements OnInit {
  form: FormGroup;
  reportes: Reporte[] = [];

  selectedFile: File | null = null;
  selectedFileName = '';
  previewUrl: string | ArrayBuffer | null = null;
  arrastrando = signal(false);
  guardando = signal(false);
  errorArchivo = signal('');

  constructor(
    private fb: FormBuilder,
    private service: EvidenciaService,
    private reporteService: ReporteService,
    private router: Router,
    private snack: MatSnackBar,
    private translate: TranslateService,
    public auth: AuthService,
  ) {
    this.form = this.fb.group({
      reporteId: [null, Validators.required],
    });
  }

  ngOnInit() {
    // ADMIN/AUTHORITY ven todos los reportes; USER solo puede asociar
    // evidencia a SUS propios reportes (el backend le bloquea /listar).
    if (this.auth.tieneRol('ADMIN', 'AUTHORITY')) {
      this.reporteService.list().subscribe((d) => (this.reportes = d));
    } else {
      const usuarioId = this.auth.getUsuarioId();
      if (usuarioId) {
        this.reporteService.historialPorUsuario(usuarioId).subscribe((d) => (this.reportes = d));
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    this.procesarArchivo(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.arrastrando.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.arrastrando.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.arrastrando.set(false);
    const file = event.dataTransfer?.files?.[0];
    this.procesarArchivo(file);
  }

  private procesarArchivo(file?: File) {
    if (!file) return;
    this.errorArchivo.set('');

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      this.errorArchivo.set(this.translate.instant('EVIDENCIA.FORM.ERROR_FORMATO'));
      return;
    }
    if (file.size > TAMANO_MAXIMO_BYTES) {
      this.errorArchivo.set(this.translate.instant('EVIDENCIA.FORM.ERROR_TAMANO'));
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  quitarArchivo() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.previewUrl = null;
    this.errorArchivo.set('');
  }

  guardar() {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      if (!this.selectedFile) {
        this.errorArchivo.set(this.translate.instant('EVIDENCIA.FORM.ERROR_SIN_ARCHIVO'));
      }
      return;
    }

    this.guardando.set(true);
    const reporteId = this.form.value.reporteId;

    this.service.upload(this.selectedFile, reporteId).subscribe({
      next: () => {
        this.guardando.set(false);
        this.snack.open(this.translate.instant('EVIDENCIA.MENSAJES.CREADO'), 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/evidencias']);
      },
      error: (err) => {
        this.guardando.set(false);
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
