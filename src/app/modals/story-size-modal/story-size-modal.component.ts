import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Story } from "src/app/interfaces/story.interface";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { ProjectService } from "src/app/services/project.service";
import { Project } from "src/app/interfaces/project.interface";

@Component({
  selector: "app-story-size-modal",
  templateUrl: "./story-size-modal.component.html",
  styleUrls: ["./story-size-modal.component.scss"],
})
export class StorySizeModalComponent implements OnInit {
  project: Project;
  story: Story;
  form: FormGroup;
  myControl = new FormControl();
  newSize: boolean = true;
  errorMsg: string;
  loading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { project: Project; story: Story },
    private dialogRef: MatDialogRef<StorySizeModalComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {
    this.project = data.project;
    this.story = data.story;
  }

  ngOnInit(): void {
    if (this.story.size) {
      this.newSize = false;
      this.form = this.formBuilder.group({
        projectId: this.project.id,
        id: this.story.id,
        size: [
          this.story.size,
          [Validators.required, Validators.min(1), Validators.max(15)],
        ],
      });
    } else {
      this.form = this.formBuilder.group({
        projectId: this.project.id,
        id: this.story.id,
        size: [
          "",
          [Validators.required, Validators.min(1), Validators.max(15)],
        ],
      });
    }
  }

  saveStory() {
    if (this.form.invalid || this.loading) {
      return;
    }
    this.loading = true;
    this.projectService
      .updateStory(this.project.id, this.story.id, this.form.value)
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
    console.log(this.form.value);
  }
}
