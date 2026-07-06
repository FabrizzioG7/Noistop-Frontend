export class Usuario {
  pkUsuarioId: number = 0;
  nombre: string = '';
  email: string = '';
  password: string = '';
  rolId: number = 0;
  nombreRol?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsuarioRanking {
  nombre: string;
  cantidadReportes: number;
}