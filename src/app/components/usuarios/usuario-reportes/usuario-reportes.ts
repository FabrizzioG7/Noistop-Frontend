import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { UsuarioRanking } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario';

@Component({
  selector: 'app-usuario-reportes',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './usuario-reportes.html',
  styleUrl: './usuario-reportes.scss'
})
export class UsuarioReportes implements OnInit {
  topReportadores$!: Observable<UsuarioRanking[]>;
  displayedColumns: string[] = ['nombre', 'cantidadReportes'];

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    this.topReportadores$ = this.service.getTopReportadores();
  }
}