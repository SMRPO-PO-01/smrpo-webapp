import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Board } from '../../interfaces/board.interface'
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  projectId = 1;
  boards : Board[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.initBoards();
  }

  drop(event: CdkDragDrop<string[]>) {
    this.updateTask(event);
  }

  initBoards() {
    this.getTasks(this.projectId, 'UNASSIGNED');
    this.getTasks(this.projectId, 'ASSIGNED');
    this.getTasks(this.projectId, 'ACTIVE');
    this.getTasks(this.projectId, 'DONE');
  }

  getTasks(project: number, state: String) {
    this.taskService.getTasks({'project': project.toString(), 'search': state}).subscribe(tasks => {
      this.boards.push({title: state, tasks: tasks})
    });
  }

  updateTask(event: CdkDragDrop<string[]>) {
    var taskId = event.previousContainer.data["tasks"][event.previousIndex].id;
    var newState = event.container.data["title"];
    console.log(taskId);
    console.log(newState);

    this.taskService.updateTask({'id': taskId, 'state': newState}).subscribe(task => {
      if (task.id = taskId) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data["tasks"], event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data["tasks"],
                            event.container.data["tasks"],
                            event.previousIndex,
                            event.currentIndex);
        }
      }
    });
  }

}