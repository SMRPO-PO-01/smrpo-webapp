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
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { project: Project; storyId: number },
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
    this.form = this.formBuilder.group({
      projectId: this.data.project.id,
      storyId: this.data.storyId,
      title: ["", Validators.required],
      state: ["UNASSIGNED"],
      description: [""],
      time: ["", [Validators.required, Validators.min(1), Validators.max(10)]],
      assignee: [""],
      assigneeId: [null],
      assigneeUser: [null],
    });
  }
  /**
 * projectId: this.data.projectId,
        title: ["", Validators.required],
        description: ["", Validators.required],
        acceptanceTests: ["", Validators.required],
        priority: ["", Validators.required],
        businessValue: ["", [Validators.required, Validators.min(1), Validators.max(10)]],
 */
  createTask() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);

    this.loading = true;
    this.taskService.createTask(this.project.id, this.form.value).subscribe(
      (res) => {
        this.dialogRef.close(res);
      },
      (err) => {
        console.log(err);
        if (err.status === 409) {
          // this.errorMsg = err.body.message;

          this.loading = false;
        }
      }
    );
  }

  onAssigneeBlur() {
    const user = this.assigneeUser.value;

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
