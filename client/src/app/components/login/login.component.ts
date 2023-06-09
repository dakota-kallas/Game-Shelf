import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() email?: string;
  @Input() password?: string;
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.email = '';
    this.password = '';
  }

  login() {
    this.errorOccured = false;
    this.errorMsg = '';

    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe((user) => {
        if (typeof user === 'object' && 'email' in user && user.email) {
          this.email = '';
          this.password = '';
          this.router.navigateByUrl('discover');
        } else if (!(typeof user === 'object')) {
          this.errorMsg = user;
          this.errorOccured = true;
          this.password = '';
        } else {
          this.errorMsg = 'Something went wrong, try again later.';
          this.errorOccured = true;
          this.password = '';
        }
      });
    }
  }
}
