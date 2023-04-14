import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameShelf } from 'src/app/models/game-shelf.model';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
import { GameShelfService } from 'src/app/services/gameshelf.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  private static EMPTY_Game = {
    bgaGameId: '',
    name: undefined,
    rating: undefined,
    image: undefined,
    thumbnail: undefined,
    minPlayers: undefined,
    maxPlayers: undefined,
    year: undefined,
    playtime: undefined,
    plays: undefined,
    rank: undefined,
    trendingRank: undefined,
    description: undefined,
    minAge: undefined,
    rules: undefined,
    publisher: undefined,
  };
  game: Game = Object.assign({}, GameComponent.EMPTY_Game);

  private gameId: string = '';
  Math = window.Math;
  gameShelf: GameShelf | undefined;
  inShelf: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameApi: GameService,
    private gameShelfApi: GameShelfService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['gid'];
      this.gameApi.getOne(this.gameId).subscribe((game) => {
        game.description = this.ensureHTMLTags(game.description);
        this.game = game;
        this.getGameShelf();
      });
    });
  }

  getGameShelf() {
    this.gameShelfApi.getGameShelf().subscribe((gameShelf) => {
      if (gameShelf.owner) {
        this.gameShelf = gameShelf;
        this.inShelf = this.isGameInShelf(this.game);
      }
    });
  }

  isGameInShelf(game: Game): boolean {
    if (
      this.gameShelf &&
      this.gameShelf.games.findIndex((g) => g.bgaGameId == game.bgaGameId) != -1
    ) {
      return true;
    }
    return false;
  }

  addGameToShelf(game: Game) {
    this.gameShelfApi.addGameToShelf(game).subscribe((gameShelf) => {
      if (
        gameShelf &&
        this.gameShelf &&
        gameShelf.games.findIndex((g) => g.bgaGameId == game.bgaGameId) != -1
      ) {
        this.gameShelf.games.push(game);
        this.inShelf = true;
      }
    });
  }

  removeFromShelf(gameId: String) {
    this.gameShelfApi.removeGameFromShelf(gameId).subscribe((game) => {
      if (game && this.gameShelf) {
        this.gameShelf.games = this.gameShelf?.games.filter(
          (game) => game.bgaGameId !== gameId
        );
        this.inShelf = false;
      }
    });
  }

  ensureHTMLTags(description: String | undefined): String | undefined {
    if (description) {
      description = '<div>' + description;
      description = description + '</div>';
    }

    return description;
  }
}
