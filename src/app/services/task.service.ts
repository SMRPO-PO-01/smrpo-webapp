import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Task } from "../interfaces/task.interface";
import { of } from "rxjs";
import { Story } from "../interfaces/story.interface";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(
    projectId: number,
    story: Story,
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
          story: story.id.toString(),
        },
      }),
    });
  }

  deleteTask(projectId: number, taskId: number) {
    return this.http.delete<Task>(`project/${projectId}/task`, {
      params: new HttpParams({
        fromObject: {
          id: taskId.toString(),
        },
      }),
    });
  }

  createTask(projectId: number, data: any) {
    return this.http.post<Task>(`project/${projectId}/task`, data);
  }
  updateTask(data: any, projectId: number) {
    return this.http.put<Task>(`project/${projectId}/task`, data);
  }
}
