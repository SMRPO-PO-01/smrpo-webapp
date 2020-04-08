import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormArray, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-users-on-project",
  templateUrl: "./users-on-project.component.html",
  styleUrls: ["./users-on-project.component.scss"],
})
export class UsersOnProjectComponent implements OnInit {
  @Input() users: AbstractControl[];

  @Output() onRemove = new EventEmitter<number>();

  displayedColumns: string[] = ["name", "delete"];

  constructor() {}

  ngOnInit(): void {}

  removeUser(i: number) {
    this.onRemove.emit(i);
  }
}
