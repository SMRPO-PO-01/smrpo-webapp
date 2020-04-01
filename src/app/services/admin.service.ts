import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";

import { User } from "../interfaces/user.interface";
import { InfoSnackbarComponent } from "../snackbars/info-snackbar/info-snackbar.component";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  createUser(data: User) {
    return this.http.post<User>("admin/add-user", data).pipe(
      tap(() =>
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "User was successfully created!" },
          duration: 5000
        })
      )
    );
  }

  getAllUsers(search = "", page = 1, perPage = 100) {
    return this.http.get<Array<User>>("admin/users", {
      params: new HttpParams({
        fromObject: {
          page: page.toString(),
          perPage: perPage.toString(),
          search
        }
      })
    });
  }
}
