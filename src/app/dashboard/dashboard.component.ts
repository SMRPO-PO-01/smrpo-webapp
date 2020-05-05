import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { USER_ROLE } from '../interfaces/user.interface';
import { RootStore } from '../store/root.store';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  userName$: Observable<string>;
  lastLogin$: Observable<Date>;

  isSidebarOpen = true;

  constructor(private rootStore: RootStore, private router: Router) {}

  ngOnInit() {
    this.userName$ = this.rootStore.userStore.user$.pipe(
      map(
        (user) =>
          `${user.firstName} ${user.lastName} (${
            user.role === USER_ROLE.ADMIN ? "Admin" : "User"
          })`
      )
    );

    this.lastLogin$ = this.rootStore.userStore.user$.pipe(
      map((user) => user.lastLoginTime)
    );
  }

  onLogout() {
    this.rootStore.userStore.clearSettings();
    this.router.navigate(["/auth", "login"]);
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  get isAdmin() {
    return this.rootStore.userStore.user.role === USER_ROLE.ADMIN;
  }
}
