import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { CUSTOM_VALIDATORS } from "../../../utils/custom-validators";
import { Project } from "../../interfaces/project.interface";
import { ProjectService } from "../../services/project.service";

@Component({
  selector: "app-create-sprint-modal",
  templateUrl: "./create-sprint-modal.component.html",
  styleUrls: ["./create-sprint-modal.component.scss"],
})
export class CreateSprintModalComponent implements OnInit {
  form: FormGroup;

  minStartDate = new Date();

  errorMsg: string;

  private loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { projectId: number },
    private dialogRef: MatDialogRef<CreateSprintModalComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      projectId: this.data.projectId,
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      velocity: [
        null,
        [Validators.required, Validators.min(1), CUSTOM_VALIDATORS.isInt],
      ],
    });
  }

  createSprint() {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    delete this.errorMsg;
    this.projectService
      .createSprint(this.data.projectId, this.form.value)
      .subscribe(
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

  get minEndDate() {
    return this.form.get("startDate").value || this.minStartDate;
  }
}
