import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../guards/admin.guard';
import { ProjectResolver } from '../resolvers/project.resolver';
import { SprintsResolver } from '../resolvers/sprints.resolver';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { BoardsComponent } from './boards/boards.component';
import { DashboardComponent } from './dashboard.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { MyAccountComponent } from './my-account/my-account.component';
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
      {
        path: "my-account",
        component: MyAccountComponent,
      },
      {
        path: "admin/add-user",
        component: AddUserComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "admin/edit-users",
        component: EditUsersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "admin/add-project",
        component: AddProjectComponent,
        canActivate: [AdminGuard],
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
