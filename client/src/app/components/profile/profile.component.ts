import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;

  constructor(
    private router: Router,
    private userApi: UserService,
    private authApi: AuthService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authApi.fetchUser().subscribe((user) => {
      this.user = user;
    });
  }

  onSubmit() {
    if (this.user) {
      this.userApi.updateUser(this.user).subscribe((user) => {
        this.user = user;
      });
    }
  }
}
