import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  currentUser!: UserCredential;

  constructor(
    private fb: FormBuilder,
    private db: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.db.getLocalStorage('userCredentials');

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\.-]+@[a-z\d\.-]+\.[a-z]{2,}$/i),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  formStatus(control: string) {
    return (
      this.loginForm.get(control)?.invalid &&
      (this.loginForm.get(control)?.dirty ||
        this.loginForm.get(control)?.touched)
    );
  }

  getErrorMessage(control: string) {
    if (control === 'email') {
      if (this.loginForm.get(control)?.hasError('required')) {
        return 'This field is required';
      }
      if (this.loginForm.get(control)?.hasError('pattern')) {
        return 'Provide a valid email adress';
      }
    }
    if (control === 'password') {
      if (this.loginForm.get(control)?.hasError('required')) {
        return 'This field is required';
      } else {
        return 'Password is to short';
      }
    }

    return '';
  }

  async onSubmit() {
    await this.db.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.router.navigate(['/']);
  }
}
