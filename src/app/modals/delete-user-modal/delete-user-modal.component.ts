import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from '../../interfaces/user.interface';

@Component({
  selector: "app-delete-user-modal",
  templateUrl: "./delete-user-modal.component.html",
  styleUrls: ["./delete-user-modal.component.scss"],
})
export class DeleteUserModalComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
