import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-acciones',
  imports: [RouterOutlet],
  templateUrl: './acciones.html',
  styleUrl: './acciones.scss',
})
export class Acciones {
  constructor(public route: ActivatedRoute) {}
}
