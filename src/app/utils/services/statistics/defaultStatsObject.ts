export interface Statistics {
  totalUsers: number;
  totalShifts: number;
  statsPerMonth: {
    workedHoursByShift: {
      [key: string]: {
        [key: string]: number;
      };
    };
    earnedRevenueByShift: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
  earnedRevenueByMonth: {
    [key: string]: number;
  };
  shiftCountByMonth: {
    [key: string]: number;
  };
}

export const defaultStatsObject: Statistics = {
  totalUsers: 0,
  totalShifts: 0,
  statsPerMonth: {
    workedHoursByShift: {
      january: {},
      february: {},
      march: {},
      april: {},
      may: {},
      june: {},
      july: {},
      august: {},
      september: {},
      october: {},
      november: {},
      december: {},
    },
    earnedRevenueByShift: {
      january: {},
      february: {},
      march: {},
      april: {},
      may: {},
      june: {},
      july: {},
      august: {},
      september: {},
      october: {},
      november: {},
      december: {},
    },
  },
  earnedRevenueByMonth: {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  },
  shiftCountByMonth: {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  },
};
