import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(data: any) {
    return this.http.get<Task[]>(`project/${data.project}/task`, {
      params: data,
    });
  }

  updateTask(data: any, projectId: number) {
    return this.http.put<Task>(`project/${projectId}/task`, data);
  }
}
