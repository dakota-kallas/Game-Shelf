import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user?: User;

  isAuthenticated() {
    return this.user != undefined;
  }

  constructor(private authService: AuthService, private router: Router) {}

  userString() {
    return JSON.stringify(this.user);
  }

  ngOnInit() {
    this.authService.userSubject.subscribe((user: User | undefined) => {
      this.user = user;
    });
  }

  ngOnDestroy() {}

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }
}
