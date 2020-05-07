import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CreateSprintModalComponent } from "./create-sprint-modal/create-sprint-modal.component";
import { StoryModalComponent } from "./story-modal/story-modal.component";

import { CreateTasksModalComponent } from "./create-tasks-modal/create-tasks-modal.component";
import { ShowStoryDetailsModalComponent } from "./show-story-details-modal/show-story-details-modal.component";
import { MaterialModule } from "../dashboard/material";

import { StorySizeModalComponent } from './story-size-modal/story-size-modal.component';
import { RejectStoryModalComponent } from './reject-story-modal/reject-story-modal.component';

@NgModule({
  declarations: [
    CreateSprintModalComponent,
    StoryModalComponent,
    CreateTasksModalComponent,
    ShowStoryDetailsModalComponent,

    StorySizeModalComponent,

    RejectStoryModalComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class ModalsModule {}
