import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminGuard } from '../guards/admin.guard';
import { ProjectResolver } from '../resolvers/project.resolver';
import { SprintsResolver } from '../resolvers/sprints.resolver';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { BoardsComponent } from './boards/boards.component';
import { DashboardComponent } from './dashboard.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: ProjectListComponent,
      },
      {
        path: "project/:id",
        component: BoardsComponent,
        resolve: { project: ProjectResolver, sprints: SprintsResolver },
      },
    ],
  },
  {
    path: "admin",
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: "add-user",
        component: AddUserComponent,
      },
      {
        path: "add-project",
        component: AddProjectComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminGuard, ProjectResolver, SprintsResolver],
})
export class DashboardRoutingModule {}
