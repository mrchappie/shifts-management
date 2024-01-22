export interface Statistics {
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
  totalShifts: 0,
  statsPerMonth: {
    workedHoursByShift: {
      january: {
        lidl: 0,
        penny: 0,
      },
      february: {
        lidl: 0,
        penny: 0,
      },
      march: {
        lidl: 0,
        penny: 0,
      },
      april: {
        lidl: 0,
        penny: 0,
      },
      may: {
        lidl: 0,
        penny: 0,
      },
      june: {
        lidl: 0,
        penny: 0,
      },
      july: {
        lidl: 0,
        penny: 0,
      },
      august: {
        lidl: 0,
        penny: 0,
      },
      september: {
        lidl: 0,
        penny: 0,
      },
      october: {
        lidl: 0,
        penny: 0,
      },
      november: {
        lidl: 0,
        penny: 0,
      },
      december: {
        lidl: 0,
        penny: 0,
      },
    },
    earnedRevenueByShift: {
      january: {
        lidl: 0,
        penny: 0,
      },
      february: {
        lidl: 0,
        penny: 0,
      },
      march: {
        lidl: 0,
        penny: 0,
      },
      april: {
        lidl: 0,
        penny: 0,
      },
      may: {
        lidl: 0,
        penny: 0,
      },
      june: {
        lidl: 0,
        penny: 0,
      },
      july: {
        lidl: 0,
        penny: 0,
      },
      august: {
        lidl: 0,
        penny: 0,
      },
      september: {
        lidl: 0,
        penny: 0,
      },
      october: {
        lidl: 0,
        penny: 0,
      },
      november: {
        lidl: 0,
        penny: 0,
      },
      december: {
        lidl: 0,
        penny: 0,
      },
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
