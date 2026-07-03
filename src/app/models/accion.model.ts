export class AccionAdministrativa {
  pkAccionId: number = 0;
  detalle: string = '';
  fechaAccion?: string;
  usuarioId: number = 0;
  nombreUsuario?: string;
  reporteId: number = 0;
  createdAt?: string;
}
export interface AccionMensual{
  mes: string;       // "2026-06"
  autoridad: string; // "Municipalidad de Lima"
  total: number;
}
