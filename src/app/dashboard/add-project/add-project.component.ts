import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { PROJECT_USER_ROLE } from 'src/app/interfaces/project.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AdminService } from 'src/app/services/admin.service';
import { ProjectService } from 'src/app/services/project.service';
import { WarningSnackbarComponent } from 'src/app/snackbars/warning-snackbar/warning-snackbar.component';

import { CustomErrorStateMatcher } from '../../../utils/custom-error-state-matcher';

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})
export class AddProjectComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  errorMatcher = new CustomErrorStateMatcher();
  options: User[] = [];
  filteredOptions: Observable<User[]>;

  selectedUsers: AbstractControl[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private adminService: AdminService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.firstName)),
      debounceTime(250),
      switchMap((value) => this.adminService.getAllUsers(value))
    );
  }

  sendData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);

    this.projectService.createProject(this.form.value).subscribe(
      () => {
        this.buildForm();
      },
      (error) => {
        if (error.status === 409) {
          this.title.setErrors({ invalidTitle: error.body.message });
        } else {
          console.error(error);
        }
      }
    );
  }

  addUser(user: User) {
    this.myControl.patchValue("");

    if (this.users.value.some((u) => u.id === user.id)) {
      this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: { message: "User already added!" },
        duration: 5000,
      });
      return;
    }

    this.users.push(
      this.formbuilder.group({
        user,
        id: user.id,
        role: PROJECT_USER_ROLE.DEVELOPER,
      })
    );

    this.selectedUsers = [...this.users.controls];
  }

  removeUser(index: number) {
    this.users.removeAt(index);
    this.selectedUsers = [...this.users.controls];
  }

  private buildForm() {
    this.form = this.formbuilder.group({
      title: ["", Validators.required],
      users: this.formbuilder.array([]),
    });

    this.form.setValidators((form: FormControl) => {
      const users: Array<{ id: number; role: PROJECT_USER_ROLE }> = form.get(
        "users"
      ).value;

      const projectOwners = users.filter(
        (user) => user.role === PROJECT_USER_ROLE.PROJECT_OWNER
      ).length;
      const scrumMasters = users.filter(
        (user) => user.role === PROJECT_USER_ROLE.SCRUM_MASTER
      ).length;

      if (projectOwners !== 1 || scrumMasters !== 1)
        return {
          error:
            "Project should have exactly 1 Project owner and 1 Scrum master.",
        };
    });
  }

  get title() {
    return this.form.get("title");
  }

  get users() {
    return this.form.get("users") as FormArray;
  }
}
