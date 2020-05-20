import { Component, OnInit, Inject, Input, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  Project,
  ProjectWithStories,
} from "src/app/interfaces/project.interface";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexChart,
  ChartComponent,
} from "ng-apexcharts";
import { TaskService } from "src/app/services/task.service";
import { Task, TASK_STATE } from "src/app/interfaces/task.interface";
import { WarningSnackbarComponent } from "src/app/snackbars/warning-snackbar/warning-snackbar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AddProjectComponent } from "src/app/dashboard/add-project/add-project.component";
import { AddProjectModalComponent } from "../add-project-modal/add-project-modal.component";
import { RootStore } from "src/app/store/root.store";
import { USER_ROLE } from "src/app/interfaces/user.interface";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: "app-show-project-info",
  templateUrl: "./show-project-info.component.html",
  styleUrls: ["./show-project-info.component.scss"],
})
export class ShowProjectInfoComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  storiesOptions: Partial<ChartOptions>;
  tasksOptions: Partial<ChartOptions>;
  project: ProjectWithStories;
  areTasksEmpty: boolean = true;
  tasks: Task[];
  isScrumMaster$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      project: ProjectWithStories;
    },
    private rootStore: RootStore,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.project = data.project;
    this.loadProjectStoriesChart();
    this.loadTasksChart();
  }

  ngOnInit(): void {
    this.isScrumMaster$ = this.rootStore.userStore.user$.pipe(
      map((user) => user.id === this.project.scrumMaster.id)
    );
    this.isAdmin$ = this.rootStore.userStore.user$.pipe(
      map((user) => user.role === USER_ROLE.ADMIN)
    );
  }

  loadProjectStoriesChart() {
    this.storiesOptions = {
      series: [
        this.project.backlog.length ? this.project.backlog.length : 0,
        this.project.sprint
          ? this.project.sprint.length
            ? this.project.sprint.length
            : 0
          : 0,
        this.project.accepted.length ? this.project.accepted.length : 0,
      ],
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Backlog", "Sprint", "Accepted"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

  loadTasksChart() {
    this.tasksOptions = {
      series: [0, 0, 0, 0],
      chart: {
        width: 390,
        type: "pie",
      },
      labels: ["Done", "Active", "Assigned", "Unassigned"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 210,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
    this.taskService.getTasks(this.project.id).subscribe(
      (tasks: Task[]) => {
        if (tasks === undefined) {
          this.areTasksEmpty = false;
        }
        this.tasks = tasks;

        let unassigned: number = 0;
        let assigned: number = 0;
        let done: number = 0;
        let active: number = 0;

        tasks.forEach((task) => {
          switch (task.state) {
            case TASK_STATE.UNASSIGNED:
              unassigned++;
              break;
            case TASK_STATE.ASSIGNED:
              assigned++;
              break;
            case TASK_STATE.DONE:
              done++;
              break;
            case TASK_STATE.ACTIVE:
              active++;
              break;
            default:
              break;
          }
        });
        this.tasksOptions.series = [
          done ? done : 0,
          active ? active : 0,
          assigned ? assigned : 0,
          unassigned,
        ];
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

  editProject(project: Project) {
    this.dialog
      .open(AddProjectModalComponent, {
        data: {
          project: this.project,
        },
      })
      .afterClosed()
      .subscribe((res: Project) => {
        this.project.title = res.title;
        this.project.projectOwner = res.projectOwner;
        this.project.scrumMaster = res.scrumMaster;
        this.project.developers = res.developers;
      });
  }

  // get isAdmin() {
  //   return this.rootStore.userStore.user.role === USER_ROLE.ADMIN;
  // }
}
