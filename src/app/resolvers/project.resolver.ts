import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { ProjectWithStories } from '../interfaces/project.interface';
import { ProjectService } from '../services/project.service';

@Injectable()
export class ProjectResolver implements Resolve<ProjectWithStories> {
  constructor(private projectService: ProjectService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.projectService.getById(route.params.id);
  }
}
