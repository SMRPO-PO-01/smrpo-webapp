import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Project } from '../../interfaces/project.interface';
import { CreateSprintModalComponent } from '../../modals/create-sprint-modal/create-sprint-modal.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"]
})
export class ProjectListComponent implements OnInit {
  projects: Project[];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projectService.getMyProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  addSprint(project: Project) {
    this.dialog
      .open(CreateSprintModalComponent, {
        data: {
          project
        }
      })
      .afterClosed()
      .subscribe(console.log);
  }
}
