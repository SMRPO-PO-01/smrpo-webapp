import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";

import { toDateOnlyString } from "../../utils/to-date-only-string";
import { Project, ProjectWithStories } from "../interfaces/project.interface";
import { Sprint } from "../interfaces/sprint.interface";
import { Story } from "../interfaces/story.interface";
import { InfoSnackbarComponent } from "../snackbars/info-snackbar/info-snackbar.component";
import { RootStore } from "../store/root.store";
import { User } from "../interfaces/user.interface";

@Injectable({
  providedIn: "root",
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
          duration: 5000,
        })
      )
    );
  }

  updateProject(project: Project) {
    return this.http.put(`project/${project.id}`, project);
  }

  getMyProjects() {
    return this.http.get<Project[]>("project/my");
  }

  getById(id: number) {
    return this.http.get<ProjectWithStories>(`project/${id}`);
  }

  getAllUsers(search = "", page = 1, perPage = 100) {
    return this.http.get<{ users: User[]; count: number }>("user/list-all", {
      params: new HttpParams({
        fromObject: {
          page: page.toString(),
          perPage: perPage.toString(),
          search,
        },
      }),
    });
  }

  createSprint(projectId: number, sprint: Sprint) {
    return this.http
      .post(`project/${projectId}/sprint`, {
        ...sprint,
        startDate: toDateOnlyString(sprint.startDate),
        endDate: toDateOnlyString(sprint.endDate),
      })
      .pipe(
        tap(() =>
          this.snackBar.openFromComponent(InfoSnackbarComponent, {
            data: { message: "Sprint was successfully created!" },
            duration: 5000,
          })
        )
      );
  }

  getSprintsForProject(projectId: number) {
    return this.http.get<Sprint[]>(`project/${projectId}/sprint`);
  }

  getSprintWithStories(projectId: number, sprintId: number) {
    return this.http.get<Sprint[]>(`project/${projectId}/sprint/${sprintId}`);
  }

  createStory(projectId: number, story: Story) {
    return this.http
      .post(`project/${projectId}/story`, {
        ...story,
      })
      .pipe(
        tap(() =>
          this.snackBar.openFromComponent(InfoSnackbarComponent, {
            data: { message: "Story was successfully created!" },
            duration: 5000,
          })
        )
      );
  }

  updateStory(projectId: number, storyId: number, story: Story) {
    return this.http
      .put(`project/${projectId}/story`, {
        id: storyId,
        ...story,
      })
      .pipe(
        tap(() =>
          this.snackBar.openFromComponent(InfoSnackbarComponent, {
            data: { message: "Story was successfully updated!" },
            duration: 5000,
          })
        )
      );
  }

  deleteStory(projectId: number, storyId: number) {
    return this.http.delete(`project/${projectId}/story/${storyId}`);
  }

  getStories(projectId: number) {
    return this.http.get<Story[]>(`project/${projectId}/story`);
  }

  addStoriesToSprint(projectId: number, sprintId: number, stories: Story[]) {
    return this.http.put<Sprint>(`project/${projectId}/sprint/add-stories`, {
      sprintId,
      stories: stories.map((story) => story.id),
    });
  }
}
