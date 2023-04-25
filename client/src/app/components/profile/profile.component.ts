import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private userId: string = '';
  private currentUser: User | undefined;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userApi: UserService,
    private authApi: AuthService,
    private location: Location
  ) {}

  ngOnInit() {
    this.resetError();
    this.route.params.subscribe((params) => {
      this.userId = params['uid'];
      this.authApi.fetchUser().subscribe((currentUser) => {
        this.currentUser = currentUser;
        if (
          currentUser &&
          (currentUser.admin || currentUser._id == this.userId)
        ) {
          this.userApi.getUser(this.userId).subscribe((user) => {
            this.user = user;
            this.email = user.email;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
          });
        }
      });
    });
  }

  onSubmit() {
    this.resetError();
    if (this.user) {
      if (this.password == this.confirmPassword) {
        if (this.password == '' || this.validatePassword(this.password)) {
          this.userApi
            .updateUser(
              this.firstName,
              this.lastName,
              this.user.enabled,
              this.user.admin,
              this.password,
              this.user
            )
            .subscribe((user) => {
              this.user = user;
              if (!this.currentUser?.admin) {
                this.authApi.setUser(user);
              }
              this.router.navigateByUrl('login');
            });
        } else {
          this.errorMsg = 'Password must be at least 8 characters.';
          this.errorOccured = true;
        }
      } else {
        this.errorMsg = 'Passwords must match.';
        this.errorOccured = true;
      }
    }
  }

  onCancel() {
    this.location.back();
  }

  validatePassword(password: string): boolean {
    if (password.length < 8) {
      return false;
    }

    if (/\s/.test(password)) {
      return false;
    }

    return true;
  }

  resetError() {
    this.errorOccured = false;
    this.errorMsg = '';
  }
}
