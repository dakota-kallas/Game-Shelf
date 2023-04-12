import { Component, OnInit } from '@angular/core';
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

  constructor(private userApi: UserService, private authApi: AuthService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
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

  enableUsers(): void {
    const users: User[] = this.users.filter((user) => user.selected).map(selectedUser => {
      const user: User = {
        _id: selectedUser._id,
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        enabled: selectedUser.enabled,
        admin: selectedUser.admin
      }});
    for (const user of users) {
      this.userApi
        .updateUser(user.firstName, user.lastName, true, user.admin, user)
        .subscribe((updatedUser) => {
          if (!user.enabled && updatedUser.enabled) {
            console.log(`User ${updatedUser.email} enabled.`);
          }
        });
    }
  }

  disableUsers(): void {
    const users: User[] = this.users.filter((user) => user.selected).map(selectedUser => {
      const user: User = {
        _id: selectedUser._id,
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        enabled: selectedUser.enabled,
        admin: selectedUser.admin
      }
    for (const user of users) {
      this.userApi
        .updateUser(user.firstName, user.lastName, false, user.admin, user)
        .subscribe((updatedUser) => {
          if (user.enabled && !updatedUser.enabled) {
            console.log(`User ${updatedUser.email} disabled.`);
          }
        });
    }
  }
}
