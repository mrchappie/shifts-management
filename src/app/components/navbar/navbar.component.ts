import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarRoutes, adminRoutes, userRoutes } from './navbarData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentState!: State;
  isAdmin: boolean | undefined = false;
  navbarUserRoutes: NavbarRoutes[] = userRoutes;
  navbarAdminRoutes: NavbarRoutes[] = adminRoutes;
  isLoggedIn: boolean = false;
  currentName: string | undefined | null = '';
  public theme: string = 'light';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.currentName = this.currentState.currentLoggedFireUser?.firstName;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.currentName = this.currentState.currentLoggedFireUser!.firstName;
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
    await this.DB.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('class', this.theme);

    this.DB.setLocalStorage('theme', this.theme);
  }
}
