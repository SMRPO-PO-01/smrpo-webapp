import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalsModule } from '../modals/modals.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { BoardsComponent } from './boards/boards.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from './material';
import { ProjectListComponent } from './project-list/project-list.component';
import { UsersOnProjectComponent } from './users-on-project/users-on-project.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { MyAccountComponent } from './my-account/my-account.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AddUserComponent,
    ProjectListComponent,
    BoardsComponent,
    AddProjectComponent,
    UsersOnProjectComponent,
    EditUsersComponent,
    MyAccountComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DragDropModule,
    ModalsModule
  ]
})
export class DashboardModule {}
