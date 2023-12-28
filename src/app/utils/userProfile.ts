export const userProfile = {
  profileImage: '',
  userName: '',
  phoneNumber: '',
  accountCreationDate: new Date(),
  adminPanel: {
    isAdmin: false,
  },
  emailVerified: false,

  userWorkplaces: [],
  shiftsCount: {
    lastWeek: 0,
    thisWeek: 0,
    nextWeek: 0,
    totalShifts: 0,
  },
};
