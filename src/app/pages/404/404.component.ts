import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-404',
  templateUrl: './404.component.html',
  imports: [RouterLink],
})
export class NotFoundComponent {}
