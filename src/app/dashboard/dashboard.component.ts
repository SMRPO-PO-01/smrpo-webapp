import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { User } from "../interfaces/user.interface";
import { RootStore } from "../store/root.store";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  user$: Observable<User>;

  constructor(private rootStore: RootStore, private router: Router) {}

  ngOnInit() {
    this.user$ = this.rootStore.userStore.user$;
  }

  onLogout() {
    this.rootStore.userStore.clearSettings();
    this.router.navigate(["/auth", "login"]);
  }
}
