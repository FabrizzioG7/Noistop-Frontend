export class Ubicacion {
  pkUbicacionId: number = 0;
  ubicacion: string = '';
  distrito: string = '';
  longitud: number = 0;
  latitud: number = 0;
  createdAt?: string;
}

export interface DistritoRanking {
  distrito: string;
  cantidadReportes: number;
}
