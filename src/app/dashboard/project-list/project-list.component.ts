import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { Project } from "../../interfaces/project.interface";
import { CreateSprintModalComponent } from "../../modals/create-sprint-modal/create-sprint-modal.component";
import { ProjectService } from "../../services/project.service";
import { Observable } from "rxjs";
import { User } from "src/app/interfaces/user.interface";
import { RootStore } from "src/app/store/root.store";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
})
export class ProjectListComponent implements OnInit {
  projects: Project[];

  user$: Observable<User>;

  constructor(
    private projectService: ProjectService,
    private rootStore: RootStore,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projectService.getMyProjects().subscribe((projects) => {
      this.projects = projects;
    });

    this.user$ = this.rootStore.userStore.user$;
  }

  addSprint(projectId: number) {
    this.dialog
      .open(CreateSprintModalComponent, {
        data: {
          projectId,
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }
}
