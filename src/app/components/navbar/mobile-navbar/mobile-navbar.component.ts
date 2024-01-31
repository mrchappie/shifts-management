import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { NavbarRoutes, userRoutes, adminRoutes } from '../navbarData';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { DividerComponent } from '../../UI/divider/divider.component';

@Component({
  standalone: true,
  selector: 'app-mobile-navbar',
  templateUrl: './mobile-navbar.component.html',
  styleUrls: ['./mobile-navbar.component.scss'],
  imports: [
    MatIconModule,
    NgIf,
    DividerComponent,
    NgFor,
    RouterLink,
    RouterLinkActive,
  ],
})
export class MobileNavbarComponent {
  currentState!: State;
  isAdmin: string | undefined = 'user ';
  navbarUserRoutes: NavbarRoutes[] = userRoutes;
  navbarAdminRoutes: NavbarRoutes[] = adminRoutes;
  isLoggedIn: boolean = false;
  currentName: any = '';
  theme: string | null = localStorage.getItem('theme')
    ? localStorage.getItem('theme')
    : window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  openMobileNav: boolean = false;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.currentName = {
      firstName: this.currentState.currentLoggedFireUser?.firstName,
      lastName: this.currentState.currentLoggedFireUser?.lastName,
    };

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.currentName = {
        firstName: this.currentState.currentLoggedFireUser?.firstName,
        lastName: this.currentState.currentLoggedFireUser?.lastName,
      };
      this.isAdmin = this.currentState.currentLoggedFireUser?.role;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    await this.authService.logout();
    this.router.navigate(['']);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('class', this.theme);

    this.firestore.setLocalStorage('theme', this.theme);
  }

  toggleMobileNav(event: Event) {
    event.stopPropagation();
    this.openMobileNav = !this.openMobileNav;
  }
}
