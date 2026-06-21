import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ubicaciones',
  imports: [RouterOutlet],
  templateUrl: './ubicaciones.html',
  styleUrl: './ubicaciones.scss',
})
export class Ubicaciones {
  constructor(public route: ActivatedRoute) {}
}
