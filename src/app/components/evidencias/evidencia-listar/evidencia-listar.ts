import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { EvidenciaService } from '../../../services/evidencia';
import { EvidenciaReporte } from '../../../models/evidencia.model';
import { AuthService } from '../../../services/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EvidenciaPreviewDialog } from '../evidencia-preview-dialog/evidencia-preview-dialog';

@Component({
  selector: 'app-evidencia-listar',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './evidencia-listar.html',
  styleUrl: './evidencia-listar.scss',
})
export class EvidenciaListar implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<EvidenciaReporte>();

  // pkEvidenciaId -> object URL de la miniatura ya descargada
  imagenes = new Map<number, SafeUrl>();
  imagenesUrlCruda = new Map<number, string>();
  imagenesError = new Set<number>();

  private objectUrls: string[] = [];

  constructor(
    private service: EvidenciaService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public auth: AuthService,
  ) {}

  esUser(): boolean {
    return this.auth.getRol() === 'USER';
  }

  // Eliminar evidencias: solo ADMIN
  puedeEliminar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }

  get displayedColumns(): string[] {
    return ['imagen', 'archivo', 'reporteId', 'fecha', 'acciones'];
  }

  ngOnInit() {
    this.cargar();
    this.service.getList().subscribe((d) => (this.dataSource.data = d));
  }

  ngOnDestroy() {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  cargar() {
    // USER: solo ve las evidencias de sus propios reportes. ADMIN/AUTHORITY ven todas.
    if (this.esUser()) {
      const usuarioId = this.auth.getUsuarioId();
      if (!usuarioId) {
        this.dataSource.data = [];
        return;
      }
      this.service.listByUsuario(usuarioId).subscribe({
        next: (d) => {
          this.dataSource.data = d;
          this.cargarImagenes(d);
        },
        error: () => (this.dataSource.data = []),
      });
      return;
    }

    this.service.list().subscribe({
      next: (d) => {
        this.dataSource.data = d;
        this.cargarImagenes(d);
      },
      error: () => (this.dataSource.data = []),
    });
  }

  private cargarImagenes(evidencias: EvidenciaReporte[]) {
    evidencias.forEach((e) => {
      if (this.imagenes.has(e.pkEvidenciaId)) return;

      this.service.getArchivoBlob(e.pkEvidenciaId).subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.objectUrls.push(objectUrl);
          this.imagenesUrlCruda.set(e.pkEvidenciaId, objectUrl);
          this.imagenes.set(e.pkEvidenciaId, this.sanitizer.bypassSecurityTrustUrl(objectUrl));
        },
        error: () => this.imagenesError.add(e.pkEvidenciaId),
      });
    });
  }

  verImagen(e: EvidenciaReporte) {
    const url = this.imagenesUrlCruda.get(e.pkEvidenciaId);
    if (!url) return;

    this.dialog.open(EvidenciaPreviewDialog, {
      data: { evidencia: e, imageUrl: url },
      panelClass: 'evidencia-preview-panel',
    });
  }

  eliminar(id: number) {
    if (!confirm(this.translate.instant('EVIDENCIA.MENSAJES.CONFIRMAR_ELIMINAR'))) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.snack.open(this.translate.instant('EVIDENCIA.MENSAJES.ELIMINADO'), 'OK', {
          duration: 3000,
        });

        this.imagenes.delete(id);
        this.imagenesUrlCruda.delete(id);
        this.cargar();
      },

      error: (e) =>
        this.snack.open(
          this.translate.instant('EVIDENCIA.MENSAJES.ERROR_ELIMINAR') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        ),
    });
  }
}
