import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Story } from "src/app/interfaces/story.interface";
import { MaterialModule } from "src/app/dashboard/material";
import { Task } from "src/app/interfaces/task.interface";
import { TaskService } from "../../services/task.service";
import { CreateTasksModalComponent } from "../create-tasks-modal/create-tasks-modal.component";
@Component({
  selector: "app-show-story-details-modal",
  templateUrl: "./show-story-details-modal.component.html",
  styleUrls: ["./show-story-details-modal.component.scss"],
})
export class ShowStoryDetailsModalComponent implements OnInit {
  story: Story;
  projectId: number;
  tasks: Task[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { projectId: number; story: Story },
    private taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.story = data.story;
    this.projectId = data.projectId;
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks(this.projectId, this.story).subscribe((tasks) => {
      console.log(tasks);
      this.tasks = tasks;
    });
  }

  addTask() {
    this.dialog
      .open(CreateTasksModalComponent, {
        data: {
          projectId: this.projectId,
          storyId: this.story.id,
        },
      })
      .afterClosed()
      .subscribe();
  }

  editTask(task: Task) {
    console.log(task);
  }
}
