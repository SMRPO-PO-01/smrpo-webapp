import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Board {
  title: String
  cards: Card[]
}

interface Card {
  title: String,
  text: String
}

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  boards : Board[] = [
    {title: "Unassigned", cards: [{title: "Card title", text: "lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor"}]},
    {title: "Assigned", cards: [{title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}]},
    {title: "Active", cards: [{title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}]},
    {title: "Done", cards: [{title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}, {title: "Card title", text: "lorem ipsum dolor"}]},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
