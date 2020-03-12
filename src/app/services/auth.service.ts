import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { User } from '../interfaces/user.interface';
import { RootStore } from '../store/root.store';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient, private rootStore: RootStore) {}

  login(data: { username: string; password: string }) {
    return this.http
      .post<User>("auth/login", data)
      .pipe(tap(user => this.rootStore.userStore.setUser(user)));
  }
}
