import { Component, OnInit } from '@angular/core';
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
  email: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userApi: UserService,
    private authApi: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['uid'];
      this.authApi.fetchUser().subscribe((currentUser) => {
        if (currentUser.admin) {
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
    if (this.user) {
      this.userApi
        .updateUser(
          this.firstName,
          this.lastName,
          this.user.enabled,
          this.user.admin,
          this.user
        )
        .subscribe((user) => {
          this.user = user;
          this.router.navigateByUrl('login');
        });
    }
  }
}
