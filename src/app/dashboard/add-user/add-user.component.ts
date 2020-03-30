import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CUSTOM_VALIDATORS } from "src/utils/custom-validators";
import { AdminService } from "src/app/services/admin.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { USER_ROLE } from "src/app/interfaces/user.interface";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  errorMatcher = new LoginErrorStateMatcher();
  usernameError: string;

  constructor(formbuilder: FormBuilder, private adminService: AdminService) {
    this.form = formbuilder.group({
      username: ["", Validators.required],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          CUSTOM_VALIDATORS.atLeastOneNumber,
          CUSTOM_VALIDATORS.upperAndLowerLetters
        ]
      ],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: [USER_ROLE.USER, Validators.required]
    });
  }

  ngOnInit(): void {}

  sendData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    delete this.usernameError;

    this.adminService.createUser(this.form.value).subscribe(
      user => {
        console.log(user);
      },
      err => {
        // Error (user že obstaja)
        this.usernameError = err.body.message;
        this.username.setErrors({ error: true });
      }
    );
  }

  get username() {
    return this.form.get("username");
  }
}

class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return control.touched && !!control.errors;
  }
}
