import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { RegisterFormDataI, registerFormData } from './formData';

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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [''],
      password: [''],
      confPass: [''],
      email: [''],
      dob: [''],
      termsAndConditions: [false],
    });
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
