import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { RegisterFormDataI, registerFormData } from './formData';
import { PasswordValidator } from './customValidators/confirmPassword';
import { AgeValidation } from './customValidators/ageValidation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  //html data
  formData: RegisterFormDataI[] = registerFormData;

  //
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        //! BUG PASS CONFIRM
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confPass: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        email: ['first name + last name@shift.app'],
        dob: ['', [Validators.required]],
        termsAndConditions: [false],
      },
      {
        validators: [
          PasswordValidator('password', 'confPass'),
          AgeValidation('dob'),
        ],
      }
    );

    this.registerForm.get('firstName')?.valueChanges.subscribe((newValue) =>
      this.registerForm.patchValue({
        email:
          (newValue + '.' + this.registerForm.value.lastName).toLowerCase() +
          '@shift.app',
      })
    );

    this.registerForm.get('lastName')?.valueChanges.subscribe((newValue) =>
      this.registerForm.patchValue({
        email:
          (this.registerForm.value.firstName + '.' + newValue).toLowerCase() +
          '@shift.app',
      })
    );
  }

  formStatus(control: string) {
    if (control != 'dob') {
      return (
        this.registerForm.get(control)?.invalid &&
        (this.registerForm.get(control)?.dirty ||
          this.registerForm.get(control)?.touched)
      );
    } else {
      return (
        (this.registerForm.get(control)?.pristine &&
          this.registerForm.get(control)?.touched) ||
        (this.registerForm.get(control)?.touched &&
          this.registerForm.get(control)?.dirty)
      );
    }
  }

  getErrorMessage(control: string) {
    if (this.registerForm.get(control)?.hasError('required')) {
      return 'This field is required';
    }

    if (control === 'email') {
      if (this.registerForm.get(control)?.hasError('pattern')) {
        return 'Provide a valid email adress';
      }
    }

    if (control === 'password') {
      if (this.registerForm.get(control)?.hasError('pattern')) {
        return '8+ chars, uppercase, lowercase, digit, special char';
      }
    }

    if (control === 'confPass') {
      if (this.registerForm.hasError('passwordsMisMatch')) {
        return 'Passwords do not match';
      }
    }

    if (control === 'firstName') {
      if (this.registerForm.get(control)?.hasError('minlength')) {
        return 'First name must be longer than 2 chars';
      }
    }

    if (control === 'lastName') {
      if (this.registerForm.get(control)?.hasError('minlength')) {
        return 'Last name must be longer than 2 chars';
      }
    }

    if (control === 'dob') {
      if (this.registerForm.hasError('ageIsNotLegal')) {
        return 'Your age must be between 18 and 65 years';
      }
    }

    return '';
  }

  async onSubmit() {
    await this.auth.register(this.registerForm.value);
    this.router.navigate(['/']);
  }
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  password: string;
  confPass: string;
  email: string;
  dob: Date;
  termsAndConditions: boolean;
}
