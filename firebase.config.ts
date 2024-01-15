export const firebaseConfig: FirebaseConfigI = {
  prod: {
    usersDB: 'shiftAppUsers',
    shiftsDB: 'shiftAppShifts',
    statistics: 'statistics',
  },
  dev: {
    usersDB: 'shiftAppUsers',
    shiftsDB: 'shiftAppShifts',
    statistics: 'statistics',
  },
};

export interface FirebaseConfigI {
  prod: { usersDB: string; shiftsDB: string; statistics: string };
  dev: { usersDB: string; shiftsDB: string; statistics: string };
}
