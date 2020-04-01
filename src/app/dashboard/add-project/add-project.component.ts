import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl
} from "@angular/forms";
// import { USER_ROLE, User } from "src/app/interfaces/user.interface";
import { AdminService } from "src/app/services/admin.service";
import { CUSTOM_VALIDATORS } from "src/utils/custom-validators";

import { CustomErrorStateMatcher } from "../../../utils/custom-error-state-matcher";
import { PROJECT_USER_ROLE } from "src/app/interfaces/project.interface";
import { Observable } from "rxjs";
import { startWith, map, switchMap, debounceTime } from "rxjs/operators";
import { User } from "src/app/interfaces/user.interface";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from "@angular/material/autocomplete";
import { ProjectService } from "src/app/services/project.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InfoSnackbarComponent } from "src/app/snackbars/info-snackbar/info-snackbar.component";
import { WarningSnackbarComponent } from "src/app/snackbars/warning-snackbar/warning-snackbar.component";
// export interface User {
//   name: string;
// }
@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"]
})
export class AddProjectComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  errorMatcher = new CustomErrorStateMatcher();
  options: User[] = []; //[{ name: "Mary" }, { name: "Shelley" }, { name: "Igor" }];
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
      map(value => (typeof value === "string" ? value : value.firstName)),
      debounceTime(250),
      switchMap(value => this.adminService.getAllUsers(value))
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
      error => {
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

    if (this.users.value.some(u => u.id === user.id)) {
      this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: { message: "User already added!" },
        duration: 5000
      });
      return;
    }

    this.users.push(
      this.formbuilder.group({
        user,
        id: user.id,
        role: PROJECT_USER_ROLE.TEAM_MEMBER
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
      users: this.formbuilder.array([])
    });
  }

  get title() {
    return this.form.get("title");
  }

  get users() {
    return this.form.get("users") as FormArray;
  }
}
