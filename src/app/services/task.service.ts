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
    // return of([
    //   {
    //     id: 14,
    //     title: "my title",
    //     description: "",
    //     state: "UNASSIGNED",
    //     createdAt: "2020-05-05T09:48:30.346Z",
    //     projectId: 24,
    //     userId: null,
    //     storyId: 1,
    //     size: null,
    //   },
    // ]);
  }
  createTask(projectId: number, data: any) {
    return this.http.post<Task>(`project/${projectId}/task`, {
      params: data,
    });
  }
  updateTask(data: any, projectId: number) {
    return this.http.put<Task>(`project/${projectId}/task`, data);
  }
}
