import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';

import { MaterialModule } from '../dashboard/material';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';
import { CreateSprintModalComponent } from './create-sprint-modal/create-sprint-modal.component';
import { CreateTasksModalComponent } from './create-tasks-modal/create-tasks-modal.component';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { ElapsedPipe } from './elapsed.pipe';
import { RejectStoryModalComponent } from './reject-story-modal/reject-story-modal.component';
import { ShowProjectInfoComponent } from './show-project-info/show-project-info.component';
import { ShowStoryDetailsModalComponent } from './show-story-details-modal/show-story-details-modal.component';
import { StoryModalComponent } from './story-modal/story-modal.component';
import { StorySizeModalComponent } from './story-size-modal/story-size-modal.component';
import { UsersOnProjectModalComponent } from './users-on-project-modal/users-on-project-modal.component';

@NgModule({
  declarations: [
    CreateSprintModalComponent,
    StoryModalComponent,
    CreateTasksModalComponent,
    ShowStoryDetailsModalComponent,
    StorySizeModalComponent,
    RejectStoryModalComponent,
    ShowProjectInfoComponent,
    AddProjectModalComponent,
    UsersOnProjectModalComponent,
    EditUserModalComponent,
    DeleteUserModalComponent,
    ElapsedPipe,
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
    NgApexchartsModule,
  ],
})
export class ModalsModule {}
