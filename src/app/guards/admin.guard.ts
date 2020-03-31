import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { USER_ROLE } from '../interfaces/user.interface';
import { RootStore } from '../store/root.store';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private rootStore: RootStore) {}

  canActivate(): Observable<boolean> {
    return this.rootStore.userStore.user$.pipe(
      map(user => user.role === USER_ROLE.ADMIN)
    );
  }
}
