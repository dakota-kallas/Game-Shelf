import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  updateUser(
    firstName: string,
    lastName: string,
    enabled: boolean,
    admin: boolean,
    password: string,
    user: User
  ): Observable<User> {
    return this.http.put<User>(this.URL + `/users`, {
      firstName: firstName,
      lastName: lastName,
      enabled: enabled,
      admin: admin,
      password: password,
      user: user,
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.URL + '/users');
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(this.URL + `/users/${userId}`);
  }
}
