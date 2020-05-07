import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
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
import { RejectStoryModalComponent } from '../../modals/reject-story-modal/reject-story-modal.component';
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
  backlogBoard: Board = { title: "Backlog", stories: [], dropDisabled: false };
  sprintBoard: Board = { title: "Sprint", stories: [], dropDisabled: false };
  acceptedBoard: Board = {
    title: "Accepted",
    stories: [],
    dropDisabled: false,
  };

  isScrumMaster$: Observable<boolean>;
  isProjectOwner$: Observable<boolean>;

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
      this.isProjectOwner$ = this.rootStore.userStore.user$.pipe(
        map((user) => user.id == this.project.projectOwner.id)
      );
    });
  }

  drop(event: CdkDragDrop<number[]>) {
    console.log(event);
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
      .subscribe((story) => {
        if (story) {
          this.backlogBoard.stories.push(story);
        }
      });
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

  sumSizes(stories: Story[]) {
    return stories.reduce((a, b) => a + b.size, 0);
  }

  storyFromBacklogDrag() {
    if (this.rootStore.userStore.user.id !== this.project.scrumMaster.id) {
      this.sprintBoard.dropDisabled = true;
    }
    this.acceptedBoard.dropDisabled = true;
  }

  storyFromBacklogDropped(story: Story, event: CdkDragDrop<Story[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (
      !this.sprintBoard.dropDisabled &&
      event.container.id === "sprint"
    ) {
      story.unsaved = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.acceptedBoard.dropDisabled = false;
    this.sprintBoard.dropDisabled = false;
  }

  storyFromSprintDrag(story: Story) {
    if (story.unsaved) {
      this.acceptedBoard.dropDisabled = true;
    } else if (
      this.rootStore.userStore.user.id !== this.project.projectOwner.id
    ) {
      this.acceptedBoard.dropDisabled = true;
      this.backlogBoard.dropDisabled = true;
    } else if (!story.allTasksCompleted) {
      this.acceptedBoard.dropDisabled = true;
    }
  }

  storyFromSprintDropped(story: Story, event: CdkDragDrop<Story[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (
      !this.sprintBoard.dropDisabled &&
      event.container.id === "backlog"
    ) {
      if (story.unsaved) {
        story.unsaved = false;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        // REJECT STORY
        story.unsaved = true;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        this.dialog
          .open(RejectStoryModalComponent, {})
          .afterClosed()
          .subscribe((res) => {
            story.unsaved = false;
            if (res) {
              story.rejectReason = res.reason;
              this.projectService
                .updateStory(this.project.id, story.id, {
                  reject: true,
                  rejectReason: story.rejectReason,
                } as any)
                .subscribe();
            } else {
              transferArrayItem(
                event.container.data,
                event.previousContainer.data,
                event.currentIndex,
                event.previousIndex
              );
            }
          });
      }
    } else if (
      !this.acceptedBoard.dropDisabled &&
      event.container.id === "accepted"
    ) {
      story.unsaved = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.acceptedBoard.dropDisabled = false;
    this.sprintBoard.dropDisabled = false;
  }

  storyFromAcceptedDrag(story: Story) {
    this.backlogBoard.dropDisabled = true;
    if (!story.unsaved) {
      this.sprintBoard.dropDisabled = true;
    }
  }

  storyFromAcceptedDropped(story: Story, event: CdkDragDrop<Story[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (story.unsaved && event.container.id === "sprint") {
      story.unsaved = false;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.backlogBoard.dropDisabled = false;
    this.sprintBoard.dropDisabled = false;
  }

  someUnsavedStories(stories: Story[]) {
    return stories.some((story) => story.unsaved);
  }

  addStoriesToSprint(stories: Story[]) {
    if (this.sumSizes(stories) > this.activeSprint.velocity) {
      return;
    }
    this.projectService
      .addStoriesToSprint(
        this.project.id,
        this.activeSprint.id,
        stories.filter((story) => story.unsaved)
      )
      .subscribe(() => {
        stories.forEach((story) => {
          story.unsaved = false;
        });
      });
  }

  acceptStories(stories: Story[]) {
    forkJoin(
      stories
        .filter((story) => story.unsaved)
        .map((story) =>
          this.projectService.updateStory(this.project.id, story.id, {
            accepted: true,
          } as any)
        )
    ).subscribe(() => {
      stories.forEach((story) => {
        story.unsaved = false;
        story.accepted = true;
      });
    });
  }

  myRoles() {
    const roles = [];
    if (this.project.scrumMaster.id === this.rootStore.userStore.user.id) {
      roles.push("Scrum master");
    }
    if (this.project.projectOwner.id === this.rootStore.userStore.user.id) {
      roles.push("Project owner");
    }
    if (
      this.project.developers.some(
        (dev) => dev.id === this.rootStore.userStore.user.id
      )
    ) {
      roles.push("Developer");
    }

    return roles.join(", ");
  }
}
