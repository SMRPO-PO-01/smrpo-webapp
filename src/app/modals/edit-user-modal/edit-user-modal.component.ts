import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CustomErrorStateMatcher } from '../../../utils/custom-error-state-matcher';
import { CUSTOM_VALIDATORS } from '../../../utils/custom-validators';
import { User } from '../../interfaces/user.interface';
import { AdminService } from '../../services/admin.service';
import { RootStore } from '../../store/root.store';

@Component({
  selector: "app-edit-user-modal",
  templateUrl: "./edit-user-modal.component.html",
  styleUrls: ["./edit-user-modal.component.scss"],
})
export class EditUserModalComponent implements OnInit {
  form: FormGroup;

  errorMatcher = new CustomErrorStateMatcher();
  usernameError: string;
  changePassword = false;

  private loading: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditUserModalComponent>,
    private rootStore: RootStore,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) private user: User,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.invalid || this.loading) {
      return;
    }

    delete this.usernameError;
    this.loading = true;

    this.adminService
      .editUser({ id: this.user.id, ...this.form.value })
      .subscribe(
        (user) => {
          this.dialogRef.close(user);
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

  private buildForm() {
    this.form = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      role: new FormControl({
        value: this.user.role,
        disabled: this.rootStore.userStore.user.id === this.user.id,
      }),
    });
  }

  get username() {
    return this.form.get("username");
  }
}
