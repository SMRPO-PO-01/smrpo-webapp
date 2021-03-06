import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { Story } from '../interfaces/story.interface';
import { Task } from '../interfaces/task.interface';
import { InfoSnackbarComponent } from '../snackbars/info-snackbar/info-snackbar.component';

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getTasks(
    projectId: number,
    story: Story = undefined,
    search = "",
    page = 1,
    perPage = 100,
    user = ""
  ) {
    return this.http.get<Task[]>(`project/${projectId}/task`, {
      params: new HttpParams({
        fromObject: {
          page: page.toString(),
          perPage: perPage.toString(),
          search,
          user,
          story: story ? story.id.toString() : "",
        },
      }),
    });
  }

  deleteTask(projectId: number, taskId: number) {
    return this.http.delete<Task>(`project/${projectId}/task/${taskId}`);
  }

  createTask(projectId: number, data: any) {
    return this.http.post<Task>(`project/${projectId}/task`, data).pipe(
      tap(() =>
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: { message: "Task was successfully created!" },
          duration: 5000,
        })
      )
    );
  }

  updateTask(data: any, projectId: number) {
    return this.http.put<Task>(`project/${projectId}/task`, data);
  }

  startWorkOnTask(projectId: number, taskId: number) {
    return this.http.put<Task>(
      `project/${projectId}/task-time/${taskId}/start`,
      {}
    );
  }

  stopWorkOnTask(projectId: number, taskId: number) {
    return this.http.put<Task>(
      `project/${projectId}/task-time/${taskId}/stop`,
      {}
    );
  }
}
