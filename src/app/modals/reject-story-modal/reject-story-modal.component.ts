import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-reject-story-modal",
  templateUrl: "./reject-story-modal.component.html",
  styleUrls: ["./reject-story-modal.component.scss"],
})
export class RejectStoryModalComponent {
  reason: string;

  constructor(private dialogRef: MatDialogRef<RejectStoryModalComponent>) {}

  rejectStory() {
    this.dialogRef.close({ reason: this.reason });
  }

  close() {
    this.dialogRef.close();
  }
}
