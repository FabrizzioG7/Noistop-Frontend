import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-roles',
  imports: [RouterOutlet],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles {
    constructor(public route:ActivatedRoute){}
}
