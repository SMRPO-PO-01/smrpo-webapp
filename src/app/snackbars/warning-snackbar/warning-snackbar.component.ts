import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: "app-warning-snackbar",
  templateUrl: "./warning-snackbar.component.html",
  styleUrls: ["./warning-snackbar.component.scss"]
})
export class WarningSnackbarComponent implements OnInit {
  message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: any) {
    this.message = data.message;
  }

  ngOnInit() {}
}
