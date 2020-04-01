import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';

import { toDateOnlyString } from '../../utils/to-date-only-string';
import { Project } from '../interfaces/project.interface';
import { Sprint } from '../interfaces/sprint.interface';
import { InfoSnackbarComponent } from '../snackbars/info-snackbar/info-snackbar.component';
import { RootStore } from '../store/root.store';

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private rootStore: RootStore,
    private snackBar: MatSnackBar
  ) {}

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

  getMyProjects(page = 1, perPage = 25, search = "") {
    return this.http
      .get<Project[]>("project/my", {
        params: new HttpParams({
          fromObject: {
            page: page.toString(),
            perPage: perPage.toString(),
            search
          }
        })
      })
      .pipe(
        map(projects =>
          projects.map(project => ({
            ...project,
            myRole: project.users.find(
              u => u.id === this.rootStore.userStore.user.id
            ).projectRole
          }))
        )
      );
  }

  createSprint(sprint: Sprint) {
    return this.http
      .post("sprint", {
        ...sprint,
        startDate: toDateOnlyString(sprint.startDate),
        endDate: toDateOnlyString(sprint.endDate)
      })
      .pipe(
        tap(() =>
          this.snackBar.openFromComponent(InfoSnackbarComponent, {
            data: { message: "Sprint was successfully created!" },
            duration: 5000
          })
        )
      );
  }
}
