import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectWithStories } from 'src/app/interfaces/project.interface';
import { Sprint } from 'src/app/interfaces/sprint.interface';
import { Story } from 'src/app/interfaces/story.interface';
import { Task, TASK_STATE } from 'src/app/interfaces/task.interface';
import { User } from 'src/app/interfaces/user.interface';
import { InfoSnackbarComponent } from 'src/app/snackbars/info-snackbar/info-snackbar.component';
import { WarningSnackbarComponent } from 'src/app/snackbars/warning-snackbar/warning-snackbar.component';
import { RootStore } from 'src/app/store/root.store';

import { TaskService } from '../../services/task.service';
import { CreateTasksModalComponent } from '../create-tasks-modal/create-tasks-modal.component';
import { StorySizeModalComponent } from '../story-size-modal/story-size-modal.component';
import { StoryModalComponent } from '../story-modal/story-modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { Board } from 'src/app/interfaces/board.interface';

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
  project: ProjectWithStories;
  projectId: number;
  tasks: Task[];
  acceptanceTests;
  sprintStories: Story[];
  board: string;
  boardStories: Board;
  areTasksEmpty: boolean = true;
  isStoryInSprint: boolean;
  isStoryInProductBackLog: boolean;
  isStoryInAccepted: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      project: ProjectWithStories;
      story: Story;
      board: string;
      boardStories: Board;
      activeSprint: Sprint;
    },
    private dialogRef: MatDialogRef<ShowStoryDetailsModalComponent>,
    private taskService: TaskService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private rootStore: RootStore,
    private snackBar: MatSnackBar
  ) {
    this.story = data.story;
    this.project = data.project;
    this.projectId = data.project.id;
    this.activeSprint = data.activeSprint;
    this.acceptanceTests = data.story.acceptanceTests
      .split("#")
      .filter((x) => x != "");
    this.board = data.board;
    this.boardStories = data.boardStories;
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
        if (res) {
          this.story.size = res.size;
          this.getTasks();
        }
      });
  }

  editStory(story: Story) {
    this.dialog
      .open(StoryModalComponent, {
        data: {
          projectId: this.project.id,
          story,
        },
      })
      .afterClosed()
      .subscribe((story) => {
        Object.assign(this.story, story);
        console.log(this.board);
      });
  }

  deleteStory(story: Story) {
    this.projectService.deleteStory(this.projectId, story.id).subscribe(
      (res) => {
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: {
            message: "Story deleted successfully.",
          },
          duration: 5000,
        });

        let delIndex = this.boardStories.stories.indexOf(story);
        if(delIndex !== -1) {
          this.boardStories.stories.splice(delIndex, 1);
        }
        this.dialogRef.close(res);
      },
      (error) => {
        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: {
            message: "Error: " + error.body.message,
          },
          duration: 5000,
        });
        console.error(error);
      }
    );
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
    if (task.userId) {
      const user = this.project.developers.find(
        (dev) => dev.id === task.userId
      );
      if (user) {
        return `${user.firstName} ${user.lastName}`;
      }
    }
    return "None";
  }

  whoAmI() {
    return this.rootStore.userStore.user;
  }

  canAcceptTask(task: Task) {
    if (!this.isStoryInSprint) {
      return false;
    }

    const me = this.rootStore.userStore.user;

    // only developers can accept tasks
    if (this.project.developers.every((dev) => dev.id !== me.id)) {
      return false;
    }

    if (task.state !== TASK_STATE.UNASSIGNED) {
      return false;
    }

    return !task.userId || task.userId === me.id;
  }

  canDeleteTask(task: Task) {
    return ![TASK_STATE.ASSIGNED, TASK_STATE.ACTIVE].includes(task.state);
  }

  canRejectTask(task: Task) {
    return (
      this.isStoryInSprint &&
      task.state !== TASK_STATE.ACTIVE &&
      task.state !== TASK_STATE.DONE &&
      task.userId === this.rootStore.userStore.user.id
    );
  }

  canStartWork(task: Task) {
    return (
      this.isStoryInSprint &&
      task.state === TASK_STATE.ASSIGNED &&
      task.userId === this.rootStore.userStore.user.id
    );
  }

  canStopWork(task: Task) {
    return (
      task.state === TASK_STATE.ACTIVE &&
      task.userId === this.rootStore.userStore.user.id
    );
  }

  canFinishTask(task: Task) {
    return (
      this.isStoryInSprint &&
      TASK_STATE.ASSIGNED === task.state &&
      task.userId === this.rootStore.userStore.user.id
    );
  }

  acceptTask(task: Task) {
    task.userId = this.rootStore.userStore.user.id;
    task.state = TASK_STATE.ASSIGNED;

    this.taskService.updateTask(task, this.projectId).subscribe();
  }

  rejectTask(task: Task) {
    task.userId = null;
    task.state = TASK_STATE.UNASSIGNED;

    this.taskService.updateTask(task, this.projectId).subscribe();
  }

  startWork(task: Task) {
    this.taskService.startWorkOnTask(this.projectId, task.id).subscribe(() => {
      task.state = TASK_STATE.ACTIVE;
    });
  }

  stopWork(task: Task) {
    this.taskService
      .stopWorkOnTask(this.projectId, task.id)
      .subscribe((res) => {
        task.state = TASK_STATE.ASSIGNED;
        task.time = res.time;
      });
  }

  finishTask(task: Task) {
    task.state = TASK_STATE.DONE;
    task.undo = true;
    this.taskService.updateTask(task, this.projectId).subscribe(console.log);
    this.story.allTasksCompleted = this.tasks.every(
      (task) => task.state === TASK_STATE.DONE
    );
  }

  undoFinishedTask(task: Task) {
    task.state = TASK_STATE.ASSIGNED;
    task.undo = false;
    this.taskService.updateTask(task, this.projectId).subscribe(console.log);
    this.story.allTasksCompleted = this.tasks.every(
      (task) => task.state === TASK_STATE.DONE
    );
  }

  getTasks() {
    this.taskService.getTasks(this.projectId, this.story).subscribe((tasks) => {
      if (tasks === undefined) {
        this.areTasksEmpty = false;
      }
      this.tasks = tasks;
      this.story.allTasksCompleted = tasks.every(
        (task) => task.state === TASK_STATE.DONE
      );
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(this.projectId, task.id).subscribe(
      (res) => {
        this.tasks = this.tasks.filter((x) => x !== task);

        this.snackBar.openFromComponent(InfoSnackbarComponent, {
          data: {
            message: "Task deleted successfully!",
          },
          duration: 5000,
        });
      },
      (err) => {
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
    if (this.isScrumMaster$ || this.isDeveloper$) {
      this.dialog
        .open(CreateTasksModalComponent, {
          data: {
            project: this.project,
            storyId: this.story.id,
            task: undefined,
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
    if (this.isScrumMaster$ || this.isDeveloper$) {
      this.dialog
        .open(CreateTasksModalComponent, {
          data: {
            project: this.project,
            storyId: this.story.id,
            task: task,
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
          message: "Sorry you don't have the rights to update tasks!",
        },
        duration: 5000,
      });
    }
  }
}
