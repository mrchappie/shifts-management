export const firestoreConfig: FirebaseConfigI = {
  firestore: {
    usersDB: 'shiftAppUsers',
    shiftsDB: {
      base: 'shiftAppShifts',
      shifts: 'shifts',
      users: 'users',
    },
    statistics: {
      base: 'statistics',
      users: 'users',
      admin: 'admin',
    },
  },
  storage: {
    profileImages: 'profile_images',
    profileAvatars: 'profile_avatars',
  },
};

export const firebaseAPIConfig: { [key: string]: string } = {
  projectId: 'learn-ang-3a987',
  appId: '1:192008310003:web:dfc33509f0f2bb7083fb86',
  storageBucket: 'learn-ang-3a987.appspot.com',
  apiKey: 'AIzaSyAyon2mKLKrbnOnI9EpoDh4JVIWi2VxWZw',
  authDomain: 'learn-ang-3a987.firebaseapp.com',
  messagingSenderId: '192008310003',
  measurementId: 'G-HPDFTGCPZG',
};

export interface FirebaseConfigI {
  firestore: {
    usersDB: string;
    shiftsDB: {
      [key: string]: string;
    };
    statistics: {
      [key: string]: string;
    };
  };
  storage: {
    profileImages: string;
    profileAvatars: string;
  };
}
