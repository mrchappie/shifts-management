import { Injectable } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateStatsService {
  constructor(private statsService: StatisticsService) {}

  addNewShiftStats(userID: string, newShiftData: Shift) {
    // update statistics in DB if a new shift is added for user
    this.statsService.updateUserStatistics(
      ['shiftCountByMonth', 'january'],
      1,
      'add',
      'shift',
      userID
    );
    this.statsService.updateUserStatistics(
      ['totalShifts'],
      1,
      'add',
      'totalShifts',
      userID
    );
    // update shift revenue per year for user
    this.statsService.updateUserStatistics(
      ['earnedRevenueByMonth', 'january'],
      newShiftData.shiftRevenue,
      'add',
      'revenue',
      userID
    );
    // update revenue per month for user
    this.statsService.updateUserStatistics(
      [
        'statsPerMonth',
        'earnedRevenueByShift',
        'january',
        newShiftData.workplace,
      ],
      newShiftData.shiftRevenue,
      'add',
      'earnedRevenue',
      userID
    );
    // update worked hours per month for user
    this.statsService.updateUserStatistics(
      [
        'statsPerMonth',
        'workedHoursByShift',
        'january',
        newShiftData.workplace,
      ],
      newShiftData.shiftRevenue / newShiftData.wagePerHour,
      'add',
      'workedHours',
      userID
    );
  }

  updateExistingShiftStats(
    userID: string,
    newShiftData: Shift,
    oldShiftData: Shift
  ) {
    const newRevenue = newShiftData.shiftRevenue;
    const oldRevenue = oldShiftData.shiftRevenue;
    const diff = newRevenue - oldRevenue;
    console.log(newRevenue, oldRevenue, diff);

    if (diff) {
      // update statistics in DB for edited shift  for user
      this.statsService.updateUserStatistics(
        ['shiftCountByMonth', 'january'],
        0,
        'add',
        'shift',
        userID
      );
      // update edited shift revenue per year for user
      this.statsService.updateUserStatistics(
        ['earnedRevenueByMonth', 'january'],
        diff,
        'add',
        'revenue',
        userID
      );
      // update edited shift revenue per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'earnedRevenueByShift',
          'january',
          newShiftData.workplace,
        ],
        newShiftData.shiftRevenue - oldShiftData.shiftRevenue,
        'add',
        'earnedRevenue',
        userID
      );
      // update edited shift worked hours per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'workedHoursByShift',
          'january',
          newShiftData.workplace,
        ],
        newShiftData.shiftRevenue / newShiftData.wagePerHour -
          oldShiftData.shiftRevenue / oldShiftData.wagePerHour,
        'add',
        'workedHours',
        userID
      );
    }
  }

  deleteShiftStats(userID: string, shiftData: Shift) {
    // substract stats when a shift is deleted
    this.statsService.updateUserStatistics(
      ['shiftCountByMonth', 'january'],
      1,
      'subtract',
      'shift',
      userID
    );
    this.statsService.updateUserStatistics(
      ['earnedRevenueByMonth', 'january'],
      shiftData.shiftRevenue,
      'subtract',
      'revenue',
      userID
    );
    this.statsService.updateUserStatistics(
      ['totalShifts'],
      1,
      'subtract',
      'totalShifts',
      userID
    );
    this.statsService.updateUserStatistics(
      ['statsPerMonth', 'earnedRevenueByShift', 'january', shiftData.workplace],
      shiftData.shiftRevenue,
      'subtract',
      'earnedRevenue',
      userID
    );
    this.statsService.updateUserStatistics(
      ['statsPerMonth', 'workedHoursByShift', 'january', shiftData.workplace],
      shiftData.shiftRevenue / shiftData.wagePerHour,
      'subtract',
      'workedHours',
      userID
    );
  }
}
