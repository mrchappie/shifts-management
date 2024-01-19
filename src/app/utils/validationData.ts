export const errorMessages = {
  required: 'This field is required!',
  login: {
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters long.',
  },
  register: {
    firstName: 'First name must be at least 2 characters long.',
    lastName: 'Last name must be at least 2 characters long.',
    email: 'Please enter a valid email address.',
    password: {
      invalid: '8+ chars, uppercase, lowercase, digit, special char',
      notMatch: 'Passwords do not match.',
    },
    confPass: {
      invalid: '8+ chars, uppercase, lowercase, digit, special char',
      notMatch: 'Passwords do not match.',
    },
    dob: 'You must be between 18 and 65 years old.',
  },
  credentials: {
    email: 'Please enter a valid email address.',
    password: {
      invalid: '8+ chars, uppercase, lowercase, digit, special char.',
      short: 'Password must be at least 8 characters long.',
      notMatch: 'Passwords do not match.',
    },
  },
  shift: {
    date: 'Please enter a valid date for the shift.',
    start: 'Please enter a valid start time for the shift.',
    end: 'Please enter a valid end time for the shift.',
    workplace: 'Workplace is required.',
    wage: 'Please enter a valid wage for the shift.',
  },
  profile: {
    firstName: 'First name must be at least 2 characters long.',
    lastName: 'Last name must be at least 2 characters long.',
    dob: 'You must be between 18 and 65 years old.',
    phoneNumber: 'Please enter a valid phone number (10 digits).',
  },
};

export const validationPatterns = {
  required: '',
  login: {
    email: /^[\w\.-]+@[a-z\d\.-]+\.[a-z]{2,}$/i,
    password: '',
  },
  register: {
    firstName: '',
    lastName: '',
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    confPass: '',
    dob: '',
  },
  credentials: {
    email: /^[\w\.-]+@[a-z\d\.-]+\.[a-z]{2,}$/i,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    confPass: '',
  },
  shift: {
    date: '',
    start: '',
    end: '',
    workplace: '',
    wage: '',
  },
  profile: {
    firstName: '',
    lastName: '',
    dob: '',
    phoneNumber: /^\d{1,10}$/,
  },
};
