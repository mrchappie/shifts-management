import { Injectable } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import { monthToString } from 'src/app/utils/functions';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateStatsService {
  constructor(private statsService: StatisticsService) {}

  addNewShiftStats(userID: string, newShiftData: Shift) {
    const month = monthToString(new Date(newShiftData.shiftDate).getMonth());
    // update statistics in DB if a new shift is added for user
    this.statsService.updateUserStatistics(
      ['shiftCountByMonth', month],
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
      ['earnedRevenueByMonth', month],
      newShiftData.shiftRevenue,
      'add',
      'revenue',
      userID
    );
    // update revenue per month for user
    this.statsService.updateUserStatistics(
      ['statsPerMonth', 'earnedRevenueByShift', month, newShiftData.workplace],
      newShiftData.shiftRevenue,
      'add',
      'earnedRevenue',
      userID
    );
    // update worked hours per month for user
    this.statsService.updateUserStatistics(
      ['statsPerMonth', 'workedHoursByShift', month, newShiftData.workplace],
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
    const newMonth = monthToString(new Date(newShiftData.shiftDate).getMonth());
    const oldMonth = monthToString(new Date(oldShiftData.shiftDate).getMonth());
    const newRevenue = newShiftData.shiftRevenue;
    const oldRevenue = oldShiftData.shiftRevenue;

    let diff;
    let month;
    let shiftCount;
    let shiftRevenue;
    let workedHours;

    // find if shift date has modified or not
    // calculate the stats based on the above condition
    if (newMonth === oldMonth) {
      diff = newRevenue - oldRevenue;
      month = oldMonth;
      shiftCount = 0;
      shiftRevenue = newShiftData.shiftRevenue - oldShiftData.shiftRevenue;
      workedHours =
        newShiftData.shiftRevenue / newShiftData.wagePerHour -
        oldShiftData.shiftRevenue / oldShiftData.wagePerHour;
    } else {
      diff = newRevenue;
      month = newMonth;
      shiftCount = 1;
      shiftRevenue = newShiftData.shiftRevenue;
      workedHours = newShiftData.shiftRevenue / newShiftData.wagePerHour;
    }
    // console.log(diff, month, shiftCount, shiftRevenue, workedHours);

    if (diff && newMonth === oldMonth) {
      // update statistics in DB for edited shift  for user
      this.statsService.updateUserStatistics(
        ['shiftCountByMonth', month],
        shiftCount,
        'add',
        'shift',
        userID
      );
      // update edited shift revenue per year for user
      this.statsService.updateUserStatistics(
        ['earnedRevenueByMonth', month],
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
          month,
          newShiftData.workplace,
        ],
        shiftRevenue,
        'add',
        'earnedRevenue',
        userID
      );
      // update edited shift worked hours per month for user
      this.statsService.updateUserStatistics(
        ['statsPerMonth', 'workedHoursByShift', month, newShiftData.workplace],
        workedHours,
        'add',
        'workedHours',
        userID
      );
    }

    if (diff && newMonth != oldMonth) {
      // update statistics in DB for edited shift  for user
      this.statsService.updateUserStatistics(
        ['shiftCountByMonth', newMonth],
        shiftCount,
        'add',
        'shift',
        userID
      );
      // update edited shift revenue per year for user
      this.statsService.updateUserStatistics(
        ['earnedRevenueByMonth', newMonth],
        oldShiftData.shiftRevenue,
        'add',
        'revenue',
        userID
      );
      // update edited shift revenue per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'earnedRevenueByShift',
          newMonth,
          newShiftData.workplace,
        ],
        oldShiftData.shiftRevenue,
        'add',
        'earnedRevenue',
        userID
      );
      // update edited shift worked hours per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'workedHoursByShift',
          newMonth,
          newShiftData.workplace,
        ],
        oldShiftData.shiftRevenue / oldShiftData.wagePerHour,
        'add',
        'workedHours',
        userID
      );
      //!----------------------------
      // update statistics in DB for edited shift  for user
      this.statsService.updateUserStatistics(
        ['shiftCountByMonth', oldMonth],
        shiftCount,
        'subtract',
        'shift',
        userID
      );
      // update edited shift revenue per year for user
      this.statsService.updateUserStatistics(
        ['earnedRevenueByMonth', oldMonth],
        oldShiftData.shiftRevenue,
        'subtract',
        'revenue',
        userID
      );
      // update edited shift revenue per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'earnedRevenueByShift',
          oldMonth,
          newShiftData.workplace,
        ],
        oldShiftData.shiftRevenue,
        'subtract',
        'earnedRevenue',
        userID
      );
      // update edited shift worked hours per month for user
      this.statsService.updateUserStatistics(
        [
          'statsPerMonth',
          'workedHoursByShift',
          oldMonth,
          newShiftData.workplace,
        ],
        oldShiftData.shiftRevenue / oldShiftData.wagePerHour,
        'subtract',
        'workedHours',
        userID
      );
    }
  }

  deleteShiftStats(userID: string, shiftData: Shift) {
    const month = monthToString(new Date(shiftData.shiftDate).getMonth());
    // substract stats when a shift is deleted
    this.statsService.updateUserStatistics(
      ['shiftCountByMonth', month],
      1,
      'subtract',
      'shift',
      userID
    );
    this.statsService.updateUserStatistics(
      ['earnedRevenueByMonth', month],
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
      ['statsPerMonth', 'earnedRevenueByShift', month, shiftData.workplace],
      shiftData.shiftRevenue,
      'subtract',
      'earnedRevenue',
      userID
    );
    this.statsService.updateUserStatistics(
      ['statsPerMonth', 'workedHoursByShift', month, shiftData.workplace],
      shiftData.shiftRevenue / shiftData.wagePerHour,
      'subtract',
      'workedHours',
      userID
    );
  }
}
