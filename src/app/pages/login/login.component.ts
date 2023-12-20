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

  constructor(
    private fb: FormBuilder,
    private db: HandleDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.db.getLocalStorage('userCredentials');

    this.loginForm = this.fb.group({
      email: ['alex@mail.com'],
      password: ['Alex2023!'],
    });
  }

  async onSubmit() {
    console.log(this.loginForm.value);
    await this.db.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.router.navigate(['/']);
  }
}
