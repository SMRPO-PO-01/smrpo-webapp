import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CustomErrorStateMatcher } from '../../../utils/custom-error-state-matcher';
import { CUSTOM_VALIDATORS } from '../../../utils/custom-validators';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { RootStore } from '../../store/root.store';

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  form: FormGroup;

  errorMatcher = new CustomErrorStateMatcher();
  usernameError: string;
  changePassword = false;

  private loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private rootStore: RootStore,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.buildForm(this.rootStore.userStore.user);
  }

  onSave() {
    if (this.form.invalid || this.loading) {
      return;
    }

    delete this.usernameError;
    this.loading = true;

    this.userService.updateMe(this.form.value).subscribe(
      (user) => {
        this.changePassword = false;
        this.buildForm(user);
        this.loading = false;
      },
      (err) => {
        // Error (user že obstaja)
        this.usernameError = err.body.message;
        this.username.setErrors({ error: true });
        this.loading = false;
      }
    );
  }

  enableEditPassword() {
    this.form.addControl(
      "password",
      new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        CUSTOM_VALIDATORS.atLeastOneNumber,
        CUSTOM_VALIDATORS.upperAndLowerLetters,
      ])
    );

    this.form.addControl("password2", new FormControl(""));

    this.form.setValidators(CUSTOM_VALIDATORS.passwordsMatch);

    this.changePassword = true;
  }

  private buildForm(user: User) {
    this.form = this.formBuilder.group({
      username: [user.username, Validators.required],
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
    });
  }

  get username() {
    return this.form.get("username");
  }
}
