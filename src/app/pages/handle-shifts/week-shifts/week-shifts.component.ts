import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SectionHeadingComponent } from 'src/app/components/UI/section-heading/section-heading.component';
import { ShiftCardRectComponent } from 'src/app/components/shift-card/shift-card-rect/shift-card-rect.component';
import { Shift } from 'src/app/utils/Interfaces';
import {
  dateToMiliseconds,
  getCurrentWeekDates,
  getLastWeekDates,
  getNextWeekDates,
} from './helpers';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { ShiftCardComponent } from 'src/app/components/shift-card/shift-card.component';
import { InlineSpinnerComponent } from 'src/app/components/spinner/inline-spinner/inline-spinner.component';
import { InlineSpinnerService } from 'src/app/utils/services/spinner/inline-spinner.service';

@Component({
  standalone: true,
  selector: 'app-week-shifts',
  templateUrl: './week-shifts.component.html',
  styleUrls: ['./week-shifts.component.scss'],
  imports: [
    ShiftCardRectComponent,
    ShiftCardComponent,
    SectionHeadingComponent,
    NgFor,
    NgIf,
    NgClass,
    InlineSpinnerComponent,
  ],
})
export class WeekShiftsComponent {
  @Input() shiftID: string = '';
  shifts: Shift[] = [];
  active: string = 'this';
  toggleSpinner!: boolean;

  constructor(
    private firestore: FirestoreService,
    private inlineSpinner: InlineSpinnerService
  ) {}

  ngOnInit(): void {
    this.inlineSpinner.spinnerState.subscribe((spinnerState) => {
      this.toggleSpinner = spinnerState;
    });

    // fetch the shifts for current week
    (async () => {
      this.shifts = await this.firestore.handleGetShiftsByWeek(
        this.shiftID,
        dateToMiliseconds(getCurrentWeekDates().start),
        dateToMiliseconds(getCurrentWeekDates().end)
      );
    })();
  }

  async setActiveWeek(week: string) {
    if (week != this.active) {
      this.active = week;
      switch (week) {
        case 'last':
          this.shifts = await this.firestore.handleGetShiftsByWeek(
            this.shiftID,
            dateToMiliseconds(getLastWeekDates().start),
            dateToMiliseconds(getLastWeekDates().end)
          );
          break;
        case 'next':
          this.shifts = await this.firestore.handleGetShiftsByWeek(
            this.shiftID,
            dateToMiliseconds(getNextWeekDates().start),
            dateToMiliseconds(getNextWeekDates().end)
          );
          break;
        default:
          this.shifts = await this.firestore.handleGetShiftsByWeek(
            this.shiftID,
            dateToMiliseconds(getCurrentWeekDates().start),
            dateToMiliseconds(getCurrentWeekDates().end)
          );
          break;
      }
    }
  }
}
