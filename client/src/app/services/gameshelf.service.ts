import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GameShelf } from '../models/game-shelf.model';

@Injectable({
  providedIn: 'root',
})
export class GameShelfService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  getGameShelf(): Observable<GameShelf> {
    return this.http.get<GameShelf>(this.URL + '/gameshelf');
  }

  addGameToShelf(gameId: string): Observable<GameShelf> {
    return this.http.put<GameShelf>(this.URL + `/gameshelf`, {
      gameId: gameId,
    });
  }
}
