import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { debounceTime, map, startWith, switchMap } from "rxjs/operators";
import { User } from "src/app/interfaces/user.interface";
import { AdminService } from "src/app/services/admin.service";
import { ProjectService } from "src/app/services/project.service";
import { WarningSnackbarComponent } from "src/app/snackbars/warning-snackbar/warning-snackbar.component";
import { CustomErrorStateMatcher } from "src/utils/custom-error-state-matcher";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Project } from "src/app/interfaces/project.interface";
import { InfoSnackbarComponent } from "src/app/snackbars/info-snackbar/info-snackbar.component";

@Component({
  selector: "app-add-project-modal",
  templateUrl: "./add-project-modal.component.html",
  styleUrls: ["./add-project-modal.component.scss"],
})
export class AddProjectModalComponent implements OnInit {
  project: Project;

  form: FormGroup;
  myControl = new FormControl();

  scrumFilteredOptions: Observable<User[]>;
  ownerFilteredOptions: Observable<User[]>;
  errorMatcher = new CustomErrorStateMatcher();
  options: User[] = [];
  filteredOptions: Observable<User[]>;

  selectedUsers: AbstractControl[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { project: Project },
    private dialogRef: MatDialogRef<AddProjectModalComponent>,
    private formbuilder: FormBuilder,
    private adminService: AdminService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.project = data.project;
  }

  ngOnInit(): void {
    this.buildForm();

    const sw = startWith("");
    const mp = map((value: any) =>
      typeof value === "string" ? value : value.firstName
    );
    const dt = debounceTime(250);
    const sm = switchMap((value: string) =>
      this.adminService.getAllUsers(value).pipe(map(({ users }) => users))
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(sw, mp, dt, sm);
    this.scrumFilteredOptions = this.scrumMaster.valueChanges.pipe(
      sw,
      mp,
      dt,
      sm
    );
    this.ownerFilteredOptions = this.projectOwner.valueChanges.pipe(
      sw,
      mp,
      dt,
      sm
    );
  }

  displayFn(user: User): string {
    return user && user.firstName ? user.firstName : "";
  }

  sendData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.projectService
      .updateProject({
        ...this.form.value,
        developers: this.developers.value.map((d) => d.id),
      })
      .subscribe(
        (res) => {
          this.snackBar.openFromComponent(InfoSnackbarComponent, {
            data: {
              message: "Project updated successfully",
            },
            duration: 5000,
          });
          this.dialogRef.close(res);
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

  onScrumMasterBlur() {
    const user = this.scrumMasterUser.value;
    if (!user || this.scrumMaster.value === "") {
      this.scrumMaster.patchValue("");
      this.scrumMasterId.patchValue(null);
      this.scrumMasterUser.patchValue(null);
    } else {
      this.scrumMaster.patchValue(`${user.firstName} ${user.lastName}`);
    }
  }

  scrumMasterSelected(user: User) {
    this.scrumMaster.patchValue(`${user.firstName} ${user.lastName}`);
    this.scrumMasterId.patchValue(user.id);
    this.scrumMasterUser.patchValue(user);
  }

  onProjectOwnerBlur() {
    const user = this.projectOwnerUser.value;
    if (!user || this.projectOwner.value === "") {
      this.projectOwner.patchValue("");
      this.projectOwnerId.patchValue(null);
      this.projectOwnerUser.patchValue(null);
    } else {
      this.projectOwner.patchValue(`${user.firstName} ${user.lastName}`);
    }
  }

  projectOwnerSelected(user: User) {
    this.projectOwner.patchValue(`${user.firstName} ${user.lastName}`);
    this.projectOwnerId.patchValue(user.id);
    this.projectOwnerUser.patchValue(user);
  }

  addUser(user: User) {
    this.myControl.patchValue("");

    if (this.developers.value.some((u) => u.id === user.id)) {
      this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: { message: "User already added!" },
        duration: 5000,
      });
      return;
    }

    this.developers.push(
      this.formbuilder.group({
        user,
        id: user.id,
      })
    );

    this.selectedUsers = [...this.developers.controls];
  }

  removeUser(index: number) {
    this.developers.removeAt(index);
    this.selectedUsers = [...this.developers.controls];
  }

  private buildForm() {
    this.form = this.formbuilder.group({
      id: [this.project.id],
      title: [this.project.title, Validators.required],
      scrumMaster: [
        `${this.project.scrumMaster.firstName} ${this.project.scrumMaster.lastName}`,
        Validators.required,
      ],
      scrumMasterId: [this.project.scrumMaster.id],
      scrumMasterUser: [this.project.scrumMaster],
      projectOwner: [
        `${this.project.projectOwner.firstName} ${this.project.projectOwner.lastName}`,
        Validators.required,
      ],
      projectOwnerId: [this.project.projectOwner.id],
      projectOwnerUser: [this.project.projectOwner],
      developers: this.formbuilder.array(
        this.project.developers.map((developer) =>
          this.formbuilder.group({ user: developer, id: developer.id })
        )
      ),
    });
    this.selectedUsers = [...this.developers.controls];
  }

  get title() {
    return this.form.get("title");
  }

  get scrumMaster() {
    return this.form.get("scrumMaster");
  }
  get projectOwner() {
    return this.form.get("projectOwner");
  }

  get scrumMasterId() {
    return this.form.get("scrumMasterId");
  }
  get projectOwnerId() {
    return this.form.get("projectOwnerId");
  }

  get scrumMasterUser() {
    return this.form.get("scrumMasterUser");
  }
  get projectOwnerUser() {
    return this.form.get("projectOwnerUser");
  }

  get developers() {
    return this.form.get("developers") as FormArray;
  }
}
