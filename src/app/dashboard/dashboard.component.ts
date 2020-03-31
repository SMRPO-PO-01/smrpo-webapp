import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { USER_ROLE } from '../interfaces/user.interface';
import { RootStore } from '../store/root.store';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(private rootStore: RootStore, private router: Router) {}

  ngOnInit() {}

  onLogout() {
    this.rootStore.userStore.clearSettings();
    this.router.navigate(["/auth", "login"]);
  }

  get isAdmin() {
    return this.rootStore.userStore.user.role === USER_ROLE.ADMIN;
  }
}
