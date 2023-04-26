import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameLog } from '../models/game-log.model';

@Injectable({
  providedIn: 'root',
})
export class GameLogService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  getGameLogsForGame(bgaGameId: string): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(
      this.URL + `/gamelogs?bgaGameId=${bgaGameId}`
    );
  }

  getGameLog(gameLogId: string): Observable<GameLog> {
    return this.http.get<GameLog>(this.URL + `/gamelogs/${gameLogId}`);
  }

  getGameLogs(): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(this.URL + `/gamelogs`);
  }

  updateGameLog(gameLog: GameLog): Observable<GameLog> {
    return this.http.put<GameLog>(this.URL + `/gamelogs/${gameLog._id}`, {
      gameLog: gameLog,
    });
  }

  createGameLog(
    bgaGameId: string,
    date: string,
    note: string | undefined,
    rating: string | undefined
  ): Observable<GameLog> {
    return this.http.post<GameLog>(this.URL + `/gamelogs`, {
      bgaGameId: bgaGameId,
      date: date,
      note: note,
      rating: rating,
    });
  }

  deleteGameLog(gameLog: GameLog): Observable<GameLog> {
    return this.http.delete<GameLog>(this.URL + `/gamelogs/${gameLog._id}`);
  }
}
