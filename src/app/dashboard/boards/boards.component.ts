import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

import { Board } from '../../interfaces/board.interface';
import { ProjectService } from 'src/app/services/project.service';
import { Sprint } from 'src/app/interfaces/sprint.interface';
import { toDateOnlyString } from 'src/utils/to-date-only-string';
import { MatDialog } from '@angular/material/dialog';
import { StoryModalComponent } from 'src/app/modals/story-modal/story-modal.component';
import { CreateSprintModalComponent } from 'src/app/modals/create-sprint-modal/create-sprint-modal.component';
import { Project } from 'src/app/interfaces/project.interface';

@Component({
  selector: "app-boards",
  templateUrl: "./boards.component.html",
  styleUrls: ["./boards.component.scss"],
})
export class BoardsComponent implements OnInit {
  projectId: number;
  activeSprint: Sprint;
  inactiveSprints: Sprint[];
  backlogBoard: Board = {title: "Backlog", stories: []};
  sprintBoard: Board = {title: "Sprint", stories: []};
  acceptedBoard: Board = {title: "Accepted", stories: []};

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.projectId = id;
    });
    this.getSprints();
    this.getStories(this.projectId);
  }

  getSprints() {
    this.projectService.getSprintsForProject(this.projectId).subscribe((sprints) => {
      console.log(sprints)
      this.inactiveSprints = sprints.filter(sprint => !this.isActiveSprint(sprint))
      this.activeSprint = sprints.filter(sprint => this.isActiveSprint(sprint))[0]
      if(this.activeSprint) {
        this.sprintBoard.title = toDateOnlyString(new Date(this.activeSprint.startDate)) + " - " +  toDateOnlyString(new Date(this.activeSprint.endDate))
        this.getActiveSprint()
      }
    });
  }

  getActiveSprint() {
    this.projectService.getSprintWithStories(this.projectId, this.activeSprint.id).subscribe((sprint) => {
      console.log(sprint);
    });
  }

  isActiveSprint(sprint: Sprint) {
    const today = new Date();
    return new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today;
  }

  addStory(projectId) {
    this.dialog
      .open(StoryModalComponent, {
        data: {
          projectId,
          undefined
        }
      })
      .afterClosed()
      .subscribe(console.log);
  }

  editStory(projectId, story) {
    this.dialog
      .open(StoryModalComponent, {
        data: {
          projectId,
          story
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }

  getStories(projectId) {
    this.projectService.getStories(projectId).subscribe((stories) => {
      this.backlogBoard.stories = stories;
    });
  }

  addSprint(projectId) {
    this.dialog
      .open(CreateSprintModalComponent, {
        data: {
          projectId,
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }
}
