import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameLog } from 'src/app/models/game-log.model';
import { GameService } from 'src/app/services/game.service';
import { GameLogService } from 'src/app/services/gamelog.service';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-gamelog',
  templateUrl: './gamelog.component.html',
  styleUrls: ['./gamelog.component.css'],
})
export class GameLogComponent implements OnInit {
  private static EMPTY_GameLog = {
    _id: '',
    bgaGameId: '',
    owner: '',
    date: '',
    note: undefined,
    rating: undefined,
  };
  gameLog: GameLog = Object.assign({}, GameLogComponent.EMPTY_GameLog);
  bgaGame: Game | undefined;
  private gameLogId: string = '';
  date: string = '';
  selectedStar: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameLogApi: GameLogService,
    private gameApi: GameService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameLogId = params['glid'];
      this.gameLogApi.getGameLog(this.gameLogId).subscribe((gameLog) => {
        this.gameLog = gameLog;
        this.date = new Date(gameLog.date).toISOString().substring(0, 10);
        this.selectedStar = this.gameLog.rating || 0;
        this.gameApi.getOne(this.gameLog.bgaGameId).subscribe((game) => {
          this.bgaGame = game;
        });
      });
    });
  }

  back() {
    console.log(`star: ${this.selectedStar}`);

    this.location.back();
  }

  update() {
    this.gameLog.date = this.date;
    this.gameLog.rating = this.selectedStar;
    this.gameLogApi.updateGameLog(this.gameLog).subscribe((updatedLog) => {
      this.location.back();
    });
  }

  delete() {
    this.gameLogApi.deleteGameLog(this.gameLog).subscribe((gameLog) => {
      this.location.back();
    });
  }
}
