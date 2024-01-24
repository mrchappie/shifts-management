import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SectionHeadingComponent } from 'src/app/components/UI/section-heading/section-heading.component';
import { ShiftCardComponent } from 'src/app/components/shift-card/shift-card.component';
import { Shift } from 'src/app/utils/Interfaces';
import {
  dateToMiliseconds,
  getCurrentWeekDates,
  getLastWeekDates,
  getNextWeekDates,
} from './helpers';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';

@Component({
  standalone: true,
  selector: 'app-week-shifts',
  templateUrl: './week-shifts.component.html',
  styleUrls: ['./week-shifts.component.scss'],
  imports: [ShiftCardComponent, SectionHeadingComponent, NgFor, NgClass],
})
export class WeekShiftsComponent {
  shifts: Shift[] = [];
  active: string = 'this';

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    // console.log(getLastWeekDates());
    // console.log(getCurrentWeekDates());
    // console.log(getNextWeekDates());

    (async () => {
      this.shifts = await this.firestore.handleGetShiftsByWeek(
        'LYuxAYp42lg1HUeofYC4mHRfd7q2',
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
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            dateToMiliseconds(getLastWeekDates().start),
            dateToMiliseconds(getLastWeekDates().end)
          );
          break;
        case 'next':
          this.shifts = await this.firestore.handleGetShiftsByWeek(
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            dateToMiliseconds(getNextWeekDates().start),
            dateToMiliseconds(getNextWeekDates().end)
          );
          break;
        default:
          this.shifts = await this.firestore.handleGetShiftsByWeek(
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            dateToMiliseconds(getCurrentWeekDates().start),
            dateToMiliseconds(getCurrentWeekDates().end)
          );
          break;
      }
    }
  }
}
