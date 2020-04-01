import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Project } from "../interfaces/project.interface";
import { tap } from "rxjs/operators";
import { InfoSnackbarComponent } from "../snackbars/info-snackbar/info-snackbar.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  createProject(project: Project) {
    return this.http.post("project/create", project).pipe(
      tap(() =>
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "Project was successfully created!" },
          duration: 5000
        })
      )
    );
  }
}
