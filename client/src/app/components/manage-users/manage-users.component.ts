import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManageUser } from 'src/app/models/manage-user.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  users: ManageUser[] = [];
  errorMsg: string = '';
  errorOccured: boolean = false;

  constructor(
    private userApi: UserService,
    private authApi: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  resetError(): void {
    this.errorOccured = false;
    this.errorMsg = '';
  }

  selectAll(e: Event): void {
    this.resetError();
    let checked = false;
    if ((e.target as HTMLInputElement).checked) {
      checked = true;
    }

    const updatedUsers = this.users.map((user) => {
      user.selected = checked;

      return user;
    });

    this.users = updatedUsers;
  }

  manageUser(): void {
    this.resetError();
    const selectedUsers: User[] = this.users
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
        };
        return user;
      });
    if (selectedUsers.length > 1 || selectedUsers.length < 1) {
      this.errorMsg = 'Only 1 user can be selected for this action.';
      this.errorOccured = true;
    } else {
      this.router.navigateByUrl(`profile`);
    }
  }

  getUsers() {
    this.resetError();
    this.userApi.getUsers().subscribe((users) => {
      for (const user of users) {
        const manageUser: ManageUser = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: user.enabled,
          admin: user.admin,
          selected: false,
        };
        this.users.push(manageUser);
      }
    });
  }

  setAdmin(admin: boolean) {
    this.resetError();
    const selectedUsers: User[] = this.users
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
        };
        return user;
      });

    for (const selectedUser of selectedUsers) {
      this.userApi
        .updateUser(
          selectedUser.firstName,
          selectedUser.lastName,
          selectedUser.enabled,
          admin,
          selectedUser
        )
        .subscribe((updatedUser) => {
          if (selectedUser.admin != updatedUser.admin) {
            const updatedUsers = this.users.map((user) => {
              if (user.email === updatedUser.email) {
                user.admin = updatedUser.admin;
              }
              return user;
            });

            this.users = updatedUsers;
          }
        });
    }
  }

  setEnabled(enabled: boolean) {
    this.resetError();
    const selectedUsers: User[] = this.users
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
        };
        return user;
      });

    for (const selectedUser of selectedUsers) {
      this.userApi
        .updateUser(
          selectedUser.firstName,
          selectedUser.lastName,
          enabled,
          selectedUser.admin,
          selectedUser
        )
        .subscribe((updatedUser) => {
          if (selectedUser.enabled != updatedUser.enabled) {
            const updatedUsers = this.users.map((user) => {
              if (user.email === updatedUser.email) {
                user.enabled = updatedUser.enabled;
              }
              return user;
            });

            this.users = updatedUsers;
          }
        });
    }
  }
}
