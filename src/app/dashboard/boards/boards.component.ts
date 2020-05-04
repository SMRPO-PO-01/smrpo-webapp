import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectWithStories } from 'src/app/interfaces/project.interface';
import { Sprint } from 'src/app/interfaces/sprint.interface';
import { CreateSprintModalComponent } from 'src/app/modals/create-sprint-modal/create-sprint-modal.component';
import { StoryModalComponent } from 'src/app/modals/story-modal/story-modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { toDateOnlyString } from 'src/utils/to-date-only-string';

import { Board } from '../../interfaces/board.interface';
import { RootStore } from '../../store/root.store';

@Component({
  selector: "app-boards",
  templateUrl: "./boards.component.html",
  styleUrls: ["./boards.component.scss"],
})
export class BoardsComponent implements OnInit {
  project: ProjectWithStories;
  activeSprint: Sprint;
  inactiveSprints: Sprint[];
  backlogBoard: Board = { title: "Backlog", stories: [] };
  sprintBoard: Board = { title: "Sprint", stories: [] };
  acceptedBoard: Board = { title: "Accepted", stories: [] };

  isScrumMaster$: Observable<boolean>;

  constructor(
    private rootStore: RootStore,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ project, sprints }) => {
      this.project = project;
      this.backlogBoard.stories = this.project.backlog;
      this.sprintBoard.stories = this.project.sprint;
      this.acceptedBoard.stories = this.project.accepted;
      this.setSprints(sprints);

      this.isScrumMaster$ = this.rootStore.userStore.user$.pipe(
        map((user) => user.id === this.project.scrumMaster.id)
      );
    });
  }

  setSprints(sprints: Sprint[]) {
    this.inactiveSprints = sprints.filter(
      (sprint) => !this.isActiveSprint(sprint)
    );
    this.activeSprint = sprints.filter((sprint) =>
      this.isActiveSprint(sprint)
    )[0];
    if (this.activeSprint) {
      this.sprintBoard.title =
        toDateOnlyString(new Date(this.activeSprint.startDate)) +
        " - " +
        toDateOnlyString(new Date(this.activeSprint.endDate));
    }
  }

  isActiveSprint(sprint: Sprint) {
    const today = new Date();
    return (
      new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today
    );
  }

  addStory() {
    this.dialog
      .open(StoryModalComponent, {
        data: {
          projectId: this.project.id,
          undefined,
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }

  editStory(story) {
    this.dialog
      .open(StoryModalComponent, {
        data: {
          projectId: this.project.id,
          story,
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }

  addSprint() {
    if (this.rootStore.userStore.user.id !== this.project.scrumMaster.id) {
      return;
    }

    this.dialog
      .open(CreateSprintModalComponent, {
        data: {
          projectId: this.project.id,
        },
      })
      .afterClosed()
      .subscribe(console.log);
  }
}
