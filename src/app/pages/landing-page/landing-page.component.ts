import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonCtaStyle2Component } from 'src/app/components/UI/button/button-cta-style2/button-cta-style2.component';
import { ButtonCtaComponent } from 'src/app/components/UI/button/button-cta/button-cta.component';

@Component({
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [RouterLink, ButtonCtaComponent, ButtonCtaStyle2Component],
})
export class LandingPageComponent {}
