import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  errorMatcher = new LoginErrorStateMatcher();

  usernameError: string;
  passwordError: string;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {}

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    delete this.usernameError;
    delete this.passwordError;

    this.authService.login(this.form.value).subscribe(
      () => {
        this.router.navigate(["/dashboard"]);
      },
      err => {
        if (err.body.message === "Wrong password") {
          this.password.setErrors({ error: true });
          this.passwordError = err.body.message;
        } else {
          this.username.setErrors({ error: true });
          this.usernameError = err.body.message;
        }
      }
    );
  }

  get username() {
    return this.form.get("username");
  }

  get password() {
    return this.form.get("password");
  }
}

class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return control.touched && !!control.errors;
  }
}
