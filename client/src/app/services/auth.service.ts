import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private URL: string = Constants.API_VERSION;
  private user?: User = undefined;
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);

  constructor(private http: HttpClient) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.getAuthenticatedUser().subscribe();
  }

  isAuthenticated() {
    return this.user != undefined;
  }

  setUser(user: User | undefined): void {
    this.user = user;
    if (this.user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
    this.userSubject.next(user);
  }

  fetchUser(): Observable<User> {
    return this.http.get<User>(this.URL + '/who/').pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }

  getAuthenticatedUser(): Observable<User> {
    let txt = window.localStorage.getItem('user');
    if (txt) {
      let user: User = JSON.parse(txt as string) as User;
      this.setUser(user);
      return of(user);
    } else {
      return this.fetchUser();
    }
  }

  login(username: string, password: string): Observable<User> {
    const API = this.URL + '/login';
    const formData = new HttpParams()
      .set('email', username)
      .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post<User>(API, formData, { headers: headers }).pipe(
      catchError((error) => {
        return of(error.error);
      }),
      tap((u) => {
        this.setUser(u);
      })
    );
  }

  logout() {
    const API = this.URL + '/logout';
    return this.http
      .post<User>(API, {})
      .pipe(tap(() => this.setUser(undefined)));
  }
}
