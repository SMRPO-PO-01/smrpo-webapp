import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: "app-info-snackbar",
  templateUrl: "./info-snackbar.component.html",
  styleUrls: ["./info-snackbar.component.scss"]
})
export class InfoSnackbarComponent implements OnInit {
  message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: any) {
    this.message = data.message;
  }

  ngOnInit() {}
}
