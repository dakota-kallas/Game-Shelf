import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameshelfService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  test(): Observable<String> {
    return this.http.get<String>(this.URL + `/discover?name=uno`);
  }
}
