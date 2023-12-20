export const firebaseConfig: FirebaseConfigI = {
  prod: { usersDB: 'shiftAppUsers', shiftsDB: 'shiftAppShifts' },
  dev: { usersDB: 'shiftAppUsers', shiftsDB: 'shiftAppShifts' },
  deploy: {
    usersDB: 'shiftAppUsers-deploy',
    shiftsDB: 'shiftAppShifts-deploy',
  },
};

export interface FirebaseConfigI {
  prod: { usersDB: string; shiftsDB: string };
  dev: { usersDB: string; shiftsDB: string };
  deploy: { usersDB: string; shiftsDB: string };
}
