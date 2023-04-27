import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameShelf } from 'src/app/models/game-shelf.model';
import { Game } from 'src/app/models/game.model';
import { GameShelfService } from 'src/app/services/gameshelf.service';

@Component({
  selector: 'app-gameshelf',
  templateUrl: './gameshelf.component.html',
  styleUrls: ['./gameshelf.component.css'],
})
export class GameShelfComponent implements OnInit {
  gameShelf: GameShelf | undefined;
  Math = window.Math;

  constructor(private gameShelfApi: GameShelfService) {}
  ngOnInit(): void {
    this.getGameShelf();
  }

  getGameShelf() {
    this.gameShelfApi.getGameShelf().subscribe((gameShelf) => {
      if (gameShelf.owner) {
        this.gameShelf = gameShelf;
      }
    });
  }

  removeFromShelf(bgaGameId: string) {
    this.gameShelfApi.removeGameFromShelf(bgaGameId).subscribe((game) => {
      if (game && this.gameShelf) {
        this.gameShelf.games = this.gameShelf?.games.filter(
          (game) => game.bgaGameId !== bgaGameId
        );
      }
    });
  }
}
