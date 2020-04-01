import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: "root"
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(data: any) {
    return this.http
      .get<Task[]>("task/all", {params: data});
  }

  updateTask(data: any) {
    return this.http.put<Task>("task/update", data);
  }
}
