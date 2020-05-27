import { Component, OnInit, Inject } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { User } from "src/app/interfaces/user.interface";
import { TaskService } from "src/app/services/task.service";
import { Project } from "src/app/interfaces/project.interface";
import { Task } from "src/app/interfaces/task.interface";

@Component({
  selector: "app-create-tasks-modal",
  templateUrl: "./create-tasks-modal.component.html",
  styleUrls: ["./create-tasks-modal.component.scss"],
})
export class CreateTasksModalComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  project: Project;
  developerFilteredOptions: User[];
  private loading = false;
  errorMsg: string;
  u: User;
  newTask: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { project: Project; storyId: number; task: Task },
    private dialogRef: MatDialogRef<CreateTasksModalComponent>,
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {
    this.project = data.project;
  }

  ngOnInit(): void {
    this.developerFilteredOptions = this.project.developers;
    this.buildForm();
  }

  buildForm() {
    if (this.data.task == undefined) {
      this.newTask = true;
      this.form = this.formBuilder.group({
        projectId: this.data.project.id,
        storyId: this.data.storyId,
        title: ["", Validators.required],
        state: ["UNASSIGNED"],
        description: [""],
        size: [
          "",
          [Validators.required, Validators.min(1), Validators.max(10)],
        ],
        user: [""],
        userId: [null],
        userUser: [null],
      });
    } else {
      this.newTask = false;
      this.u = this.project.developers
        .filter((developer) => developer.id == this.data.task.userId)
        .pop();
      this.form = this.formBuilder.group({
        projectId: this.data.project.id,
        id: this.data.task.id,
        title: [this.data.task.title, Validators.required],
        state: [this.data.task.state],
        description: [this.data.task.description],
        size: [
          this.data.task.size,
          [Validators.required, Validators.min(1), Validators.max(10)],
        ],
        user:
          this.u != undefined
            ? [`${this.u.firstName} ${this.u.lastName} (${this.u.username})`]
            : [],
        userId: this.u != undefined ? [this.data.task.userId] : [],
        userUser: this.u != undefined ? [this.u] : [],
      });
    }
  }

  createTask() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    if (this.newTask) {
      this.taskService.createTask(this.project.id, this.form.value).subscribe(
        (res) => {
          this.dialogRef.close(res);
        },
        (err) => {
          if (err.status === 409) {
            this.errorMsg = err.body.message;
            this.loading = false;
          }
        }
      );
    } else {
      // New assignee

      if (!this.u || this.form.value.userId != this.u.id) {
        this.form.value.state = "UNASSIGNED";
      }
      this.taskService.updateTask(this.form.value, this.project.id).subscribe(
        (res) => {
          this.dialogRef.close(res);
        },
        (err) => {
          if (err.status === 409) {
            this.errorMsg = err.body.message;
            this.loading = false;
          }
        }
      );
    }
  }

  onUserBlur() {
    const user = this.userUser.value;

    if (!user || this.user.value === "") {
      this.user.patchValue("");
      this.userId.patchValue(null);
      this.userUser.patchValue(null);
    } else {
      this.user.patchValue(
        `${user.firstName} ${user.lastName} (${user.username})`
      );
    }
  }

  userSelected(user: User) {
    this.user.patchValue(
      `${user.firstName} ${user.lastName} (${user.username})`
    );
    this.userId.patchValue(user.id);
    this.userUser.patchValue(user);
  }

  get user() {
    return this.form.get("user");
  }
  get userId() {
    return this.form.get("userId");
  }
  get userUser() {
    return this.form.get("userUser");
  }
}
