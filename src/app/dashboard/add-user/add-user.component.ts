import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { USER_ROLE } from 'src/app/interfaces/user.interface';
import { AdminService } from 'src/app/services/admin.service';
import { CUSTOM_VALIDATORS } from 'src/utils/custom-validators';

import { CustomErrorStateMatcher } from '../../../utils/custom-error-state-matcher';

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  errorMatcher = new CustomErrorStateMatcher();
  usernameError: string;

  constructor(
    private formbuilder: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  sendData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    delete this.usernameError;

    this.adminService.createUser(this.form.value).subscribe(
      (user) => {
        this.buildForm();
      },
      (err) => {
        // Error (user že obstaja)
        this.usernameError = err.body.message;
        this.username.setErrors({ error: true });
      }
    );
  }

  private buildForm() {
    this.form = this.formbuilder.group({
      username: ["", Validators.required],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          CUSTOM_VALIDATORS.atLeastOneNumber,
          CUSTOM_VALIDATORS.upperAndLowerLetters,
        ],
      ],
      password2: "",
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: [USER_ROLE.USER, Validators.required],
    });

    this.form.setValidators(CUSTOM_VALIDATORS.passwordsMatch);
  }

  get username() {
    return this.form.get("username");
  }
}
