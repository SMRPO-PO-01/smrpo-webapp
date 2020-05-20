import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { User } from '../interfaces/user.interface';
import { InfoSnackbarComponent } from '../snackbars/info-snackbar/info-snackbar.component';
import { RootStore } from '../store/root.store';

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private rootStore: RootStore
  ) {}

  createUser(data: User) {
    return this.http.post<User>("admin/add-user", data).pipe(
      tap(() =>
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "User was successfully created!" },
          duration: 5000,
        })
      )
    );
  }

  getAllUsers(search = "", page = 1, perPage = 100) {
    return this.http.get<{ users: User[]; count: number }>("admin/users", {
      params: new HttpParams({
        fromObject: {
          page: page.toString(),
          perPage: perPage.toString(),
          search,
        },
      }),
    });
  }

  editUser(user: User) {
    return this.http.put<User>("admin/edit-user/" + user.id, user).pipe(
      tap((user) => {
        if (user.id === this.rootStore.userStore.user.id) {
          this.rootStore.userStore.setUser(user);
        }
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "User was edited successfully!" },
          duration: 5000,
        });
      })
    );
  }

  deleteUser(user: User) {
    return this.http.delete<User>("admin/delete-user/" + user.id).pipe(
      tap(({ deleted }) => {
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: {
            message: user.deleted ? "User was deleted!" : "User was restored!",
          },
          duration: 5000,
        });
      })
    );
  }
}
