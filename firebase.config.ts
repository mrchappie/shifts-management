export const firestoreConfig: FirebaseConfigI = {
  prod: {
    usersDB: 'shiftAppUsers',
    shiftsDB: {
      base: 'shiftAppShifts',
      subColl: 'users',
    },
    statistics: 'statistics',
  },
  dev: {
    usersDB: 'shiftAppUsers',
    shiftsDB: {
      base: 'shiftAppShifts',
      subColl: 'users',
    },
    statistics: 'statistics',
  },
  storage: {
    profileImages: 'profile_images',
    profileAvatars: 'profile_avatars',
  },
};

export const firebaseAPIConfig = {
  projectId: 'learn-ang-3a987',
  appId: '1:192008310003:web:dfc33509f0f2bb7083fb86',
  storageBucket: 'learn-ang-3a987.appspot.com',
  apiKey: 'AIzaSyAyon2mKLKrbnOnI9EpoDh4JVIWi2VxWZw',
  authDomain: 'learn-ang-3a987.firebaseapp.com',
  messagingSenderId: '192008310003',
  measurementId: 'G-HPDFTGCPZG',
};

export interface FirebaseConfigI {
  prod: {
    usersDB: string;
    shiftsDB: {
      [key: string]: string;
    };
    statistics: string;
  };
  dev: {
    usersDB: string;
    shiftsDB: {
      [key: string]: string;
    };
    statistics: string;
  };
  storage: {
    profileImages: string;
    profileAvatars: string;
  };
}
