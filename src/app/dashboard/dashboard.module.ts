import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddUserComponent } from "./add-user/add-user.component";
import { MaterialModule } from "./material";
import { BoardsComponent } from './boards/boards.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [DashboardComponent, AddUserComponent, BoardsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DragDropModule
  ]
})
export class DashboardModule {}
