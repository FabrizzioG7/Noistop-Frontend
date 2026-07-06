import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mediciones',
  imports: [RouterOutlet],
  templateUrl: './mediciones.html',
  styleUrl: './mediciones.scss',
})
export class Mediciones {
  constructor(public route: ActivatedRoute) {}
}
