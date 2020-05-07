import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { RootStore } from 'src/app/store/root.store';

import { Project } from '../../interfaces/project.interface';
import { ProjectService } from '../../services/project.service';

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

  myRoles(project) {
    const roles = [];
    if (project.scrumMaster.id === this.rootStore.userStore.user.id) {
      roles.push("Scrum master");
    }
    if (project.projectOwner.id === this.rootStore.userStore.user.id) {
      roles.push("Project owner");
    }
    if (
      project.developers.some(
        (dev) => dev.id === this.rootStore.userStore.user.id
      )
    ) {
      roles.push("Developer");
    }

    return roles.join(", ");
  }
}
