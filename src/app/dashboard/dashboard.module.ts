import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalsModule } from '../modals/modals.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from './material';
import { ProjectListComponent } from './project-list/project-list.component';
import { UsersOnProjectComponent } from './users-on-project/users-on-project.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AddUserComponent,
    ProjectListComponent,
    AddProjectComponent,
    UsersOnProjectComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalsModule
  ]
})
export class DashboardModule {}
