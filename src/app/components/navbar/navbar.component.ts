import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarRoutes, adminRoutes, userRoutes } from './navbarData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { DividerComponent } from '../UI/divider/divider.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { ToastService } from 'src/app/utils/services/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    NgIf,
    MatIconModule,
    DividerComponent,
    NgFor,
    RouterLinkActive,
    RouterLink,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentState!: State;
  isAdmin: boolean | undefined = false;
  navbarUserRoutes: NavbarRoutes[] = userRoutes;
  navbarAdminRoutes: NavbarRoutes[] = adminRoutes;
  isLoggedIn: boolean = false;
  currentName: any = '';
  theme: string | null = localStorage.getItem('theme')
    ? localStorage.getItem('theme')
    : window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: FirestoreService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
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
      this.isAdmin =
        this.currentState.currentLoggedFireUser?.adminPanel.isAdmin;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('class', this.theme);

    this.DB.setLocalStorage('theme', this.theme);
  }
}
