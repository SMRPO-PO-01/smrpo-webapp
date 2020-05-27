import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "elapsed",
})
export class ElapsedPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 60) {
      return `${value} min`;
    } else {
      return `${Math.floor(value / 60)} h ${value % 60} min`;
    }
  }
}
