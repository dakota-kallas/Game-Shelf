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
  visibleUsers: ManageUser[] = [];
  value: string = '';

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

    const updatedUsers = this.visibleUsers.map((user) => {
      user.selected = checked;

      return user;
    });

    this.users = updatedUsers;
  }

  manageUser(): void {
    this.resetError();
    const selectedUsers: User[] = this.visibleUsers
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
          issuer: selectedUser.issuer,
        };
        return user;
      });
    if (selectedUsers.length > 1 || selectedUsers.length < 1) {
      this.errorMsg = 'Only 1 user can be selected for this action.';
      this.errorOccured = true;
    } else {
      this.router.navigateByUrl(`profile/${selectedUsers[0]._id}`);
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
          issuer: user.issuer,
          selected: false,
        };
        this.users.push(manageUser);
      }
      this.visibleUsers = this.users;
    });
  }

  search() {
    if (this.users && this.value != '') {
      this.visibleUsers = this.users.filter((user) =>
        user.email.includes(this.value)
      );
    } else {
      this.visibleUsers = this.users;
    }
  }

  setAdmin(admin: boolean) {
    this.resetError();
    const selectedUsers: User[] = this.visibleUsers
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
          issuer: selectedUser.issuer,
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
          '',
          selectedUser
        )
        .subscribe((updatedUser) => {
          if (selectedUser.admin != updatedUser.admin) {
            const updatedUsers = this.visibleUsers.map((user) => {
              if (user.email === updatedUser.email) {
                user.admin = updatedUser.admin;
              }
              return user;
            });

            this.users = updatedUsers;
            this.visibleUsers = updatedUsers;
          }
        });
    }
  }

  setEnabled(enabled: boolean) {
    this.resetError();
    const selectedUsers: User[] = this.visibleUsers
      .filter((user) => user.selected)
      .map((selectedUser) => {
        const user: User = {
          _id: selectedUser._id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          enabled: selectedUser.enabled,
          admin: selectedUser.admin,
          issuer: selectedUser.issuer,
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
          '',
          selectedUser
        )
        .subscribe((updatedUser) => {
          if (selectedUser.enabled != updatedUser.enabled) {
            const updatedUsers = this.visibleUsers.map((user) => {
              if (user.email === updatedUser.email) {
                user.enabled = updatedUser.enabled;
              }
              return user;
            });

            this.users = updatedUsers;
            this.visibleUsers = updatedUsers;
          }
        });
    }
  }
}
