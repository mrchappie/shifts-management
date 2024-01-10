import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { ChangeCredentialsService } from 'src/app/utils/services/changeCredential/change-credentials.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  currentUser!: UserCredential;
  showResetModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private DB: HandleDBService,
    private router: Router,
    private authService: AuthService,
    private changeCred: ChangeCredentialsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.DB.getLocalStorage('userCredentials');

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
    await this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.router.navigate(['/']);
  }

  openModal(event: Event) {
    event.preventDefault();
    this.toggleModal();
  }

  closeModal(event: Event) {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      this.toggleModal();
    }
  }

  async sendResetEmail(email: string) {
    try {
      await this.changeCred.resetPasswordEmail(email);
      this.toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  toggleModal() {
    this.showResetModal = !this.showResetModal;
  }
}
