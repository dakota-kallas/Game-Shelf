import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @Input() email?: string;
  @Input() password?: string;
  @Input() confirmPassword?: string;
  @Input() firstName?: string;
  @Input() lastName?: string;
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    this.errorOccured = false;

    if (
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.firstName &&
      this.lastName
    ) {
      if (this.confirmPassword == this.password) {
        this.authService
          .register(this.email, this.password, this.firstName, this.lastName)
          .subscribe((user) => {
            if (typeof user === 'object' && 'email' in user && user.email) {
              this.email = '';
              this.password = '';
              this.router.navigateByUrl('login');
            } else {
              this.errorMsg = 'There was an issue.';
              this.errorOccured = true;
              this.password = '';
            }
          });
      } else {
        this.errorMsg = 'Passwords must match.';
        this.errorOccured = true;
        this.password = '';
        this.confirmPassword = '';
      }
    }
  }
}
