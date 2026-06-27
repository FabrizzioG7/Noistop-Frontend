import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DistritoRanking } from '../../../models/ubicacion.model';
import { UbicacionService } from '../../../services/ubicacion';

@Component({
  selector: 'app-ubicacion-reportes',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './ubicacion-reportes.html',
  styleUrl: './ubicacion-reportes.scss'
})
export class UbicacionReportes implements OnInit {
  topDistritos$!: Observable<DistritoRanking[]>;
  displayedColumns: string[] = ['distrito', 'cantidadReportes'];

  constructor(private service: UbicacionService) {}

  ngOnInit(): void {
    this.topDistritos$ = this.service.getTopDistritos();
  }
}
