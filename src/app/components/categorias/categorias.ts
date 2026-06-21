import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-categorias',
  imports: [RouterOutlet],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class Categorias {
  constructor(public route: ActivatedRoute) {}
}
