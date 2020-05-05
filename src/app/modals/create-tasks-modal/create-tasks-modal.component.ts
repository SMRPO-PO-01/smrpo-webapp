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

@Component({
  selector: "app-create-tasks-modal",
  templateUrl: "./create-tasks-modal.component.html",
  styleUrls: ["./create-tasks-modal.component.scss"],
})
export class CreateTasksModalComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  developerFilteredOptions = [
    {
      id: 5,
      username: "armkom",
      firstName: "Armin",
      lastName: "Komić",
      email: "armkom@gmail.com",
      role: "ADMIN",
      lastLoginTime: null,
      createdAt: "2020-03-31T08:38:32.670Z",
    },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { projectId: number; storyId: number },
    private dialogRef: MatDialogRef<CreateTasksModalComponent>,
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      projectId: this.data.projectId,
      storyId: this.data.storyId,
      title: ["", Validators.required],
      description: ["", Validators.required],
      time: ["", [Validators.required, Validators.min(1), Validators.max(10)]],
      assignee: [""],
      assigneeId: [null],
      assigneeUser: [null],
    });
  }

  createTask() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  onAssigneeBlur() {
    const user = this.assigneeUser.value;
    console.log(user);

    if (!user || this.assignee.value === "") {
      this.assignee.patchValue("");
      this.assigneeId.patchValue(null);
      this.assigneeUser.patchValue(null);
    } else {
      this.assignee.patchValue(
        `${user.firstName} ${user.lastName} (${user.username})`
      );
    }
  }

  assigneeSelected(user: User) {
    console.log(user);
    this.assignee.patchValue(
      `${user.firstName} ${user.lastName} (${user.username})`
    );
    this.assigneeId.patchValue(user.id);
    this.assigneeUser.patchValue(user);
  }

  get assignee() {
    return this.form.get("assignee");
  }
  get assigneeId() {
    return this.form.get("assigneeId");
  }
  get assigneeUser() {
    return this.form.get("assigneeUser");
  }
}
