import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  search(name: string): Observable<{ games: Game[]; count: number }> {
    return this.http
      .get<Game[]>(this.URL + `/search?name=${name}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Game[]>) => {
          let searchCount = response.headers.get('Search-Count');

          if (response.body === null) {
            return { games: [], count: 0 };
          }

          return {
            games: response.body,
            count: parseInt(searchCount ?? '', 10),
          };
        })
      );
  }

  orderBy(field: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.URL + `/search?orderBy=${field}`);
  }

  getOne(bggGameId: string): Observable<Game> {
    return this.http.get<Game>(this.URL + `/games/${bggGameId}`);
  }
}
