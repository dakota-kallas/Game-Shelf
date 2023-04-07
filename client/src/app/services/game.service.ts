import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  search(name: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.URL + `/search?name=${name}`);
  }

  orderBy(field: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.URL + `/search?orderBy=${field}`);
  }
}
