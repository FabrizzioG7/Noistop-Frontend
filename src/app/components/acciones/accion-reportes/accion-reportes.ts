import {Component, OnInit} from '@angular/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {AccionMensual} from '../../../models/accion.model';
import {AccionService} from '../../../services/accion';
import {ChartConfiguration, ChartData, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-accion-reportes',
  imports: [
    MatIcon,

    BaseChartDirective,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './accion-reportes.html',
  styleUrl: './accion-reportes.scss',
})
export class AccionReportes implements OnInit {
  constructor(private accionService: AccionService) {
  }

  datos: AccionMensual[] = [];

  barChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  barChartOptions: ChartOptions<'bar'> = {};

  ngOnInit(): void {
    this.configurarGrafico();
    this.accionService
      .getComparativaMensual()
      .subscribe({
        next: data => {
          this.datos = data;
          this.generarGrafico();
        },
        error: err => console.error(err)
      });
  }

  private configurarGrafico(): void {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 13
            }
          },
          title: {
            display: true,
            text: 'Año y mes'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          },
          title: {
            display: true,
            text: 'Cantidad de acciones'
          }
        }
      }
    };
  }

  private generarGrafico(): void {
    const meses = [...new Set(
      this.datos.map(x => x.mes)
    )];
    const autoridades = [...new Set(
      this.datos.map(x => x.autoridad)
    )];
    const coloresAutoridades: { [key: string]: string } = {

      'Municipalidad de Lima': '#0FA719',

      'Fiscalización Municipal': '#1976D2',

      'Autoridad Ambiental Metropolitana': '#FF9800'

    };
    const datasets = autoridades.map((autoridad) => {
      const valores = meses.map(mes => {
        const registro = this.datos.find(x =>
          x.mes === mes &&
          x.autoridad === autoridad
        );
        return registro ? registro.total : 0;
      });
      return {
        label: autoridad,
        data: valores,
        backgroundColor: coloresAutoridades[autoridad] ?? '#607D8B',
        borderRadius: 6,
        borderWidth: 0,
        maxBarThickness: 45
      };
    });
    this.barChartData = {
      labels: meses,
      datasets
    };
  }
}

