import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { Constants } from '../constants/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private URL: string = Constants.API_VERSION;
  private user?: User = undefined;
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);

  constructor(private http: HttpClient, private router: Router) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.getAuthenticatedUser().subscribe();
  }

  isAuthenticated() {
    return this.user != undefined;
  }

  isAdmin(): boolean {
    return this.user?.admin ? true : false;
  }

  setUser(user: User | undefined): void {
    this.user = user;
    if (this.user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.clear();
    }
    this.userSubject.next(user);
  }

  fetchUser(): Observable<User | undefined> {
    return this.http.get<User>(this.URL + '/who/').pipe(
      tap((user) => {
        this.setUser(user);
        if (this.router.url == '/login') {
          this.router.navigateByUrl('discover');
          window.localStorage.setItem(
            'setupTime',
            new Date().getTime().toString()
          );
        }
      }),
      catchError((error) => {
        window.localStorage.clear();
        return of(undefined);
      })
    );
  }

  getAuthenticatedUser(): Observable<User | undefined> {
    const setup = window.localStorage.getItem('setupTime');
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    const now = new Date().getTime();

    let txt = window.localStorage.getItem('user');
    if (txt && setup && Number(setup) + tenMinutesInMilliseconds > now) {
      let user: User = JSON.parse(txt as string) as User;
      this.setUser(user);
      return of(user);
    } else {
      return this.fetchUser();
    }
  }

  login(username: string, password: string): Observable<User | string> {
    const API = this.URL + '/login';
    const formData = new HttpParams()
      .set('email', username)
      .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .post<User | string>(API, formData, { headers: headers })
      .pipe(
        catchError((error) => {
          return of(error.error);
        }),
        tap((u) => {
          if (typeof u === 'object' && 'email' in u && u.email) {
            window.localStorage.setItem(
              'setupTime',
              new Date().getTime().toString()
            );
            this.setUser(u);
          }
        })
      );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<User> {
    const API = this.URL + '/users';
    return this.http.post<User>(API, {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
  }

  logout() {
    const API = this.URL + '/logout';
    return this.http
      .post<User>(API, {})
      .pipe(tap(() => this.setUser(undefined)));
  }
}
