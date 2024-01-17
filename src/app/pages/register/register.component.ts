import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterFormDataI, registerFormData } from './formData';
import { PasswordValidator } from './customValidators/confirmPassword';
import { AgeValidation } from './customValidators/ageValidation';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { ValidationService } from './validationService/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatIconModule,
    RouterLink,
  ],
})
export class RegisterComponent {
  //html data
  formData: RegisterFormDataI[] = registerFormData;

  //
  registerForm!: FormGroup;
  termsAndConditions: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validation: ValidationService
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
        dob: ['', [Validators.required, AgeValidation]],
        termsAndConditions: [false],
      },
      {
        validators: [PasswordValidator('password', 'confPass')],
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

    this.registerForm
      .get('termsAndConditions')
      ?.valueChanges.subscribe((newValue) => {
        this.termsAndConditions = !newValue;
      });
  }

  // form validation service
  formStatus(control: string): boolean {
    return this.validation.getFormStatus(this.registerForm, control);
  }
  getErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.registerForm, control);
  }

  async onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.get('termsAndConditions')?.value === true
    ) {
      await this.authService.register(this.registerForm.value);
      this.router.navigate(['/']);
    } else {
      this.termsAndConditions = true;
    }
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
