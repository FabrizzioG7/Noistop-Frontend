import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface WelcomeDialogData {
  nombre: string;
}

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './welcome-dialog.html',
  styleUrl: './welcome-dialog.scss',
})
export class WelcomeDialog {
  constructor(
    private dialogRef: MatDialogRef<WelcomeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WelcomeDialogData,
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
