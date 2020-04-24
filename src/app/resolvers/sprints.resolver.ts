import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Sprint } from '../interfaces/sprint.interface';
import { ProjectService } from '../services/project.service';

@Injectable()
export class SprintsResolver implements Resolve<Sprint[]> {
  constructor(private projectService: ProjectService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.projectService.getSprintsForProject(route.params.id);
  }
}
