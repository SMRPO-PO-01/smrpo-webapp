import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { merge } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { User } from '../../interfaces/user.interface';
import { DeleteUserModalComponent } from '../../modals/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from '../../modals/edit-user-modal/edit-user-modal.component';
import { AdminService } from '../../services/admin.service';
import { RootStore } from '../../store/root.store';

@Component({
  selector: "app-edit-users",
  templateUrl: "./edit-users.component.html",
  styleUrls: ["./edit-users.component.scss"],
})
export class EditUsersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "firstName",
    "lastName",
    "email",
    "username",
    "role",
    "edit",
    "delete",
  ];

  data: User[];
  me: User;
  resultsLength = 0;
  loading = true;

  search = new FormControl("");

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    private rootStore: RootStore,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    merge(
      this.rootStore.userStore.user$,
      this.paginator.page,
      this.search.valueChanges.pipe(debounceTime(500))
    )
      .pipe(
        switchMap(() => {
          this.loading = true;

          this.me = this.rootStore.userStore.user;

          return this.adminService.getAllUsers(
            this.search.value,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        })
      )
      .subscribe(({ users, count }) => {
        this.loading = false;
        this.data = users;
        this.resultsLength = count;
      });
  }

  onEdit(user: User) {
    this.dialog
      .open(EditUserModalComponent, { data: user })
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this.data = this.data.map((u) => (u.id === user.id ? user : u));
        }
      });
  }

  onDelete(user: User) {
    this.dialog
      .open(DeleteUserModalComponent, { data: user })
      .afterClosed()
      .subscribe((confirmation) => {
        if (confirmation) {
          this.adminService.deleteUser(user).subscribe();
          user.deleted = !user.deleted;
        }
      });
  }
}
