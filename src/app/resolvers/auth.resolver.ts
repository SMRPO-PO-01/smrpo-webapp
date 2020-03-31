import { Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";

import { RootStore } from "../store/root.store";

@Injectable()
export class AuthResolver implements Resolve<void> {
  constructor(private rootStore: RootStore, private router: Router) {}

  resolve() {
    if (this.rootStore.userStore.authToken) {
      this.router.navigate(["/dashboard"]);
    }
  }
}
