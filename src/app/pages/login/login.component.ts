import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  showResetModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private DB: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.DB.getLocalStorage('userCredentials');

    this.loginForm = this.fb.group({
      email: ['alex@mail.com'],
      password: ['Alex2023!'],
    });
  }

  async onSubmit() {
    await this.DB.login(
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
      await this.DB.resetPasswordEmail(email);
      this.toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  toggleModal() {
    this.showResetModal = !this.showResetModal;
  }
}
