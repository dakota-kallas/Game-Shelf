import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameLog } from 'src/app/models/game-log.model';
import { GameLogService } from 'src/app/services/gamelog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  gameLogs: GameLog[] | null = null;
  visibleGameLogs: GameLog[] | null = null;
  value: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameLogApi: GameLogService,
    private location: Location
  ) {}

  ngOnInit() {
    this.gameLogApi.getGameLogs().subscribe((logs) => {
      this.gameLogs = logs;
      this.visibleGameLogs = logs;
    });
  }

  search() {
    if (this.gameLogs && this.value != '') {
      this.visibleGameLogs = this.gameLogs.filter((log) =>
        log.bgaGameName.includes(this.value)
      );
    } else {
      this.visibleGameLogs = this.gameLogs;
    }
  }
}
