import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule {}
