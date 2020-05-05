import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Story } from "src/app/interfaces/story.interface";
import { MaterialModule } from "src/app/dashboard/material";
import { Task } from "src/app/interfaces/task.interface";
import { TaskService } from "../../services/task.service";
import { CreateTasksModalComponent } from "../create-tasks-modal/create-tasks-modal.component";
import { Project } from "src/app/interfaces/project.interface";
import { USER_ROLE, User } from "src/app/interfaces/user.interface";
import { RootStore } from "src/app/store/root.store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WarningSnackbarComponent } from "src/app/snackbars/warning-snackbar/warning-snackbar.component";
import { InfoSnackbarComponent } from "src/app/snackbars/info-snackbar/info-snackbar.component";
@Component({
  selector: "app-show-story-details-modal",
  templateUrl: "./show-story-details-modal.component.html",
  styleUrls: ["./show-story-details-modal.component.scss"],
})
export class ShowStoryDetailsModalComponent implements OnInit {
  isScrumMaster: boolean;
  isProjectOwner: boolean;
  isDeveloper: boolean;
  user: User;
  story: Story;
  project: Project;
  projectId: number;
  tasks: Task[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { project: Project; story: Story },
    private taskService: TaskService,
    private dialog: MatDialog,
    private rootStore: RootStore,
    private snackBar: MatSnackBar
  ) {
    this.story = data.story;
    this.project = data.project;
    this.projectId = data.project.id;
  }

  ngOnInit(): void {
    this.getTasks();

    this.getUserRole();
  }
  getUserRole() {
    this.user = this.whoAmI();
    this.isProjectOwner = this.user.id == this.project.projectOwner.id;
    this.isScrumMaster = this.user.id == this.project.scrumMaster.id;
    this.isDeveloper = this.project.developers.some(
      (user) => user.id == this.user.id
    );
  }

  getUser(task: Task) {
    if (task.state == undefined || task.state == "UNASSIGNED") {
      return "None";
    }
    if (task.id == this.project.projectOwner.id) {
      return `${this.project.projectOwner.firstName} ${this.project.projectOwner.lastName} (${this.project.projectOwner.username})`;
    } else if (task.id == this.project.scrumMaster.id) {
      return `${this.project.scrumMaster.firstName} ${this.project.scrumMaster.lastName} (${this.project.scrumMaster.username})`;
    }

    this.project.developers.forEach((developer) => {
      if (developer.id == task.id) {
        return `${developer.firstName} ${developer.lastName} (${developer.username})`;
      }
    });
  }

  whoAmI() {
    return this.rootStore.userStore.user;
  }

  getTasks() {
    this.taskService.getTasks(this.projectId, this.story).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  deleteTask(task: Task) {
    console.log(task);

    this.taskService.deleteTask(this.projectId, task.id).subscribe(
      (res) => {
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: {
            message: res,
          },
          duration: 5000,
        });
      },
      (err) => {
        console.log(err);

        this.snackBar.openFromComponent(WarningSnackbarComponent, {
          data: {
            message: err.body.message,
          },
          duration: 5000,
        });
      }
    );
  }

  addTask() {
    if (this.isScrumMaster || this.isDeveloper) {
      this.dialog
        .open(CreateTasksModalComponent, {
          data: {
            project: this.project,
            storyId: this.story.id,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res != undefined) {
            this.getTasks();
          }
        });
    } else {
      this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: {
          message: "Sorry you don't have the rights to create new tasks!",
        },
        duration: 5000,
      });
    }
  }

  editTask(task: Task) {
    console.log(task);
  }
}
