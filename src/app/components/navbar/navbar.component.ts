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

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
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
}
