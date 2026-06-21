import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-evidencias',
  imports: [RouterOutlet],
  templateUrl: './evidencias.html',
  styleUrl: './evidencias.scss',
})
export class Evidencias {
  constructor(public route: ActivatedRoute) {}
}
