export class Reporte {
  pkReporteId: number = 0;
  descripcion: string = '';
  estado: string = 'pendiente';
  usuarioId: number = 0;
  nombreUsuario?: string;
  medicionId?: number;
  categoriaId: number = 0;
  nombreCategoria?: string;
  ubicacionId: number = 0;
  distrito?: string;
  createdAt?: string;
  evidencias?: any[];
}
