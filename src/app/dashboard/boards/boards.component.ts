import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectWithStories } from 'src/app/interfaces/project.interface';
import { Sprint } from 'src/app/interfaces/sprint.interface';
import { Story } from 'src/app/interfaces/story.interface';
import { CreateSprintModalComponent } from 'src/app/modals/create-sprint-modal/create-sprint-modal.component';
import { ShowStoryDetailsModalComponent } from 'src/app/modals/show-story-details-modal/show-story-details-modal.component';
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ project, sprints }) => {
      this.project = project;
      this.backlogBoard.stories = this.project.backlog;
      this.backlogBoard.stories.forEach((story) => (story.board = "Backlog"));
      this.sprintBoard.stories = this.project.sprint;
      this.sprintBoard.stories.forEach((story) => (story.board = "Sprint"));
      this.acceptedBoard.stories = this.project.accepted;
      this.acceptedBoard.stories.forEach((story) => (story.board = "Accepted"));
      this.setSprints(sprints);

      this.isScrumMaster$ = this.rootStore.userStore.user$.pipe(
        map((user) => user.id === this.project.scrumMaster.id)
      );
    });
  }

  drop(event: CdkDragDrop<number[]>) {
    console.log(event.previousContainer.data);
    console.log(event.container.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  fromSprintPredicate(item: CdkDrag<Story>) {
    return item.data.board === "Sprint";
  }

  openDetails(story) {
    this.dialog
      .open(ShowStoryDetailsModalComponent, {
        height: "800px",
        width: "1000px",
        data: {
          project: this.project,
          story: story,

          board: this.getBoardOfStory(story),

          activeSprint: this.activeSprint,
        },
      })
      .afterClosed()
      .subscribe();
  }

  getBoardOfStory(story: Story) {
    if (
      this.sprintBoard.stories &&
      this.sprintBoard.stories.some((s) => s.id == story.id)
    ) {
      return "Sprint";
    } else if (
      this.backlogBoard.stories &&
      this.backlogBoard.stories.some((s) => s.id == story.id)
    ) {
      return "Backlog";
    } else {
      return "Accepted";
    }
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
    const endDate = new Date(sprint.endDate);
    endDate.setDate(endDate.getDate() + 1);
    return new Date(sprint.startDate) <= today && endDate >= today;
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
