import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;

  constructor(private router: Router, private authApi: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authApi.fetchUser().subscribe((user) => {
      this.user = user;
    });
  }

  // onSubmit() {
  //   // Call the service method to update the user's profile
  //   this.userService.updateUser(updatedUser).subscribe(
  //     (response) => {
  //       console.log('User profile updated successfully');
  //       // Optionally, you can redirect the user to their updated profile page
  //       this.router.navigate(['/profile']);
  //     },
  //     (error) => {
  //       console.log('Error updating user profile');
  //     }
  //   );
  // }
}
