import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reportes',
  imports: [RouterOutlet],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes {
  constructor(public route: ActivatedRoute) {}
}
