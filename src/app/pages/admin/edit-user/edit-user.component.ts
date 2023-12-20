import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  constructor(private route: ActivatedRoute) {}
  loadShifts: boolean = false;
  userIDFromURL: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(
      (param) => (this.userIDFromURL = param['userID'])
    );
  }
}
