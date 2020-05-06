import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Story } from "src/app/interfaces/story.interface";

import { Task } from "src/app/interfaces/task.interface";
import { TaskService } from "../../services/task.service";
import { CreateTasksModalComponent } from "../create-tasks-modal/create-tasks-modal.component";
import { Project } from "src/app/interfaces/project.interface";

import { RootStore } from "src/app/store/root.store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WarningSnackbarComponent } from "src/app/snackbars/warning-snackbar/warning-snackbar.component";
import { InfoSnackbarComponent } from "src/app/snackbars/info-snackbar/info-snackbar.component";
import { Sprint } from "src/app/interfaces/sprint.interface";

import { User } from "src/app/interfaces/user.interface";
import { StorySizeModalComponent } from "../story-size-modal/story-size-modal.component";


@Component({
  selector: "app-show-story-details-modal",
  templateUrl: "./show-story-details-modal.component.html",
  styleUrls: ["./show-story-details-modal.component.scss"],
})
export class ShowStoryDetailsModalComponent implements OnInit {

  isScrumMaster$: Observable<boolean>;
  isProjectOwner$: Observable<boolean>;
  isDeveloper$: Observable<boolean>;

  activeSprint: Sprint;
  user: User;
  story: Story;
  project: Project;
  projectId: number;
  tasks: Task[];

  sprintStories: Story[];
  board: string;
  areTasksEmpty: boolean = true;
  isStoryInSprint: boolean;
  isStoryInProductBackLog: boolean;
  isStoryInAccepted: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      project: Project;
      story: Story;
      board: string;
      activeSprint: Sprint;
    },


    private taskService: TaskService,
    private dialog: MatDialog,
    private rootStore: RootStore,
    private snackBar: MatSnackBar
  ) {
    this.story = data.story;
    this.project = data.project;
    this.projectId = data.project.id;
    this.activeSprint = data.activeSprint;

    this.board = data.board;
  }

  ngOnInit(): void {
    this.getTasks();
    this.getUserRole();
    this.storyInSprint();
  }
  editTime(story: Story) {
    this.dialog
      .open(StorySizeModalComponent, {
        data: {
          project: this.project,
          story: story,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.getTasks();
        }
      });
  }

  storyInSprint() {
    this.isStoryInSprint = this.board == "Sprint";
    this.isStoryInProductBackLog = this.board == "Backlog";
    this.isStoryInAccepted = this.board == "Accepted";
  }

  getUserRole() {
    this.isProjectOwner$ = this.rootStore.userStore.user$.pipe(
      map((user) => user.id == this.project.projectOwner.id)
    );
    this.isScrumMaster$ = this.rootStore.userStore.user$.pipe(
      map((user) => user.id == this.project.scrumMaster.id)
    );
    this.isDeveloper$ = this.rootStore.userStore.user$.pipe(
      map((u) => this.project.developers.some((user) => user.id == u.id))

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

      if (tasks === undefined) {
        this.areTasksEmpty = false;
        console.log(this.tasks);
      }
      this.tasks = tasks;
    });
  }
  /**
   *
   * @param task Task Object task
   * @todo Finish
   */
  deleteTask(task: Task) {
    console.log(task);

    // this.taskService.deleteTask(this.projectId, task.id).subscribe(
    //   (res) => {
    //     this.snackBar.openFromComponent(InfoSnackbarComponent, {
    //       data: {
    //         message: res,
    //       },
    //       duration: 5000,
    //     });
    //   },
    //   (err) => {
    //     console.log(err);

    //     this.snackBar.openFromComponent(WarningSnackbarComponent, {
    //       data: {
    //         message: err.body.message,
    //       },
    //       duration: 5000,
    //     });
    //   }
    // );
  }

  addTask() {
    if (this.isScrumMaster$ || this.isDeveloper$) {

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