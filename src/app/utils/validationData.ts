export const errorMessages = {
  required: 'This field is required!',
  login: {
    email: 'Enter a valid email address.',
    password: 'Password must be 8+ characters.',
  },
  register: {
    firstName: 'First name must be 2+ characters.',
    lastName: 'Last name must be 2+ characters.',
    email: 'Enter a valid email address.',
    password: {
      invalid: '8+ chars, upper, lower, digit, special char.',
      notMatch: 'Passwords do not match.',
    },
    confPass: {
      invalid: '8+ chars, upper, lower, digit, special char.',
      notMatch: 'Passwords do not match.',
    },
    dob: 'Age requirement: 18-65 years.',
  },
  credentials: {
    email: 'Enter a valid email address.',
    password: {
      invalid: '8+ chars, upper, lower, digit, special char.',
      short: 'Password must be 8+ characters.',
      notMatch: 'Passwords do not match.',
    },
  },
  shift: {
    date: 'Enter a valid date for the shift.',
    start: 'Enter a valid start time for the shift.',
    end: 'Enter a valid end time for the shift.',
    workplace: 'Workplace is required.',
    wage: 'Enter a valid wage for the shift.',
  },
  profile: {
    firstName: 'First name must be 2+ characters.',
    lastName: 'Last name must be 2+ characters.',
    dob: 'Age requirement: 18-65 years.',
    phoneNumber: 'Enter valid 10-digit phone number.',
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
