import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenciaReporte } from '../../../models/evidencia.model';

export interface EvidenciaPreviewData {
  evidencia: EvidenciaReporte;
  imageUrl: string;
}

@Component({
  selector: 'app-evidencia-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    DatePipe,
  ],
  templateUrl: './evidencia-preview-dialog.html',
  styleUrl: './evidencia-preview-dialog.scss',
})
export class EvidenciaPreviewDialog {
  constructor(
    private dialogRef: MatDialogRef<EvidenciaPreviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EvidenciaPreviewData,
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
