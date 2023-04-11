import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  users: User[] | undefined;
  selectedUsers: User[] = [];

  constructor(private userApi: UserService, private authApi: AuthService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userApi.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onUserSelected(user: User) {
    if (this.isUserSelected(user)) {
      this.selectedUsers = this.selectedUsers.filter((u) => u !== user); // Remove user from selectedUsers array
    } else {
      this.selectedUsers.push(user); // Add user to selectedUsers array
    }
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.includes(user); // Check if user is in selectedUsers array
  }

  enableUsers(): void {}
}
