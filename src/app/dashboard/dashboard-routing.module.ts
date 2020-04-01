import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../guards/admin.guard';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: ProjectListComponent
      }
    ]
  },
  {
    path: "admin",
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: "add-user",
        component: AddUserComponent
      },
      {
        path: "add-project",
        component: AddProjectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminGuard]
})
export class DashboardRoutingModule {}
