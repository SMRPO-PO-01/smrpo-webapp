import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProjectService } from '../../services/project.service';
import { Story } from 'src/app/interfaces/story.interface';

@Component({
  selector: "app-story-modal",
  templateUrl: "./story-modal.component.html",
  styleUrls: ["./story-modal.component.scss"]
})
export class StoryModalComponent implements OnInit {
  newStory: boolean = true;
  form: FormGroup;

  errorMsg: string;

  private loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { projectId: number, story: Story },
    private dialogRef: MatDialogRef<StoryModalComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    if(this.data.story !== undefined) {
      this.newStory = false;
      this.form = this.formBuilder.group({
        projectId: this.data.projectId,
        title: [this.data.story.title, Validators.required],
        description: [this.data.story.description, Validators.required],
        acceptanceTests: [this.data.story.acceptanceTests, Validators.required],
        priority: [this.data.story.priority, Validators.required],
        businessValue: [this.data.story.businessValue, [Validators.required, Validators.min(1), Validators.max(10)]],
      });
    }
    else {
      this.form = this.formBuilder.group({
        projectId: this.data.projectId,
        title: ["", Validators.required],
        description: ["", Validators.required],
        acceptanceTests: ["", Validators.required],
        priority: ["", Validators.required],
        businessValue: ["", [Validators.required, Validators.min(1), Validators.max(10)]],
      });
    }
    
  }

  saveStory() {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    delete this.errorMsg;

    if(this.data.story !== undefined) {
      this.projectService.updateStory(this.data.projectId, this.data.story.id, this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
        },
        err => {
          if (err.status === 409) {
            this.errorMsg = err.body.message;
            this.loading = false;
          }
        }
      );
    }
    else {
      this.projectService.createStory(this.data.projectId, this.form.value).subscribe(
        res => {
          this.dialogRef.close(res);
        },
        err => {
          if (err.status === 409) {
            this.errorMsg = err.body.message;
            this.loading = false;
          }
        }
      );
    }
  }

}
