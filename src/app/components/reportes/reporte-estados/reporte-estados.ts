import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { EstadoReporteCount } from '../../../models/reporte.model';
import { ReporteService } from '../../../services/reporte';
 
@Component({
  selector: 'app-reporte-estados',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './reporte-estados.html',
  styleUrl: './reporte-estados.scss',
})
export class ReporteEstados implements OnInit {
  conteoEstados$!: Observable<EstadoReporteCount[]>;
  displayedColumns: string[] = ['estado', 'cantidad'];
 
  constructor(private service: ReporteService) {}
 
  ngOnInit(): void {
    this.conteoEstados$ = this.service.getConteoPorEstado();
  }
}
 