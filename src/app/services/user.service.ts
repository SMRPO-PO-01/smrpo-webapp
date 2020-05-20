import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { User } from '../interfaces/user.interface';
import { InfoSnackbarComponent } from '../snackbars/info-snackbar/info-snackbar.component';
import { RootStore } from '../store/root.store';

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private http: HttpClient,
    private rootStore: RootStore,
    private snackBar: MatSnackBar
  ) {}

  getMe() {
    return this.http
      .get<User>("user/me")
      .pipe(tap((user) => this.rootStore.userStore.setUser(user)));
  }

  updateMe(data: User) {
    return this.http.put<User>("user/me", data).pipe(
      tap((user) => {
        this.rootStore.userStore.setUser(user);
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "Account was successfully updated!" },
          duration: 5000,
        });
      })
    );
  }
}
