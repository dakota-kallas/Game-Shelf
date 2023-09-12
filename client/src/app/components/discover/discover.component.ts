import { Component, Input, OnInit } from '@angular/core';
import { GameShelf } from 'src/app/models/game-shelf.model';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
import { GameShelfService } from 'src/app/services/gameshelf.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
  searchGames: Game[] | null = null;
  currentSearchCount: number = 0;
  maxSearchCount: number = 0;
  trendingGames: Game[] | undefined;
  randomGames: Game[] | undefined;
  gameShelf: GameShelf | undefined;
  searched: Boolean = false;
  @Input() value: string | undefined;
  Math = window.Math;

  constructor(
    private gameApi: GameService,
    private gameShelfApi: GameShelfService
  ) {}

  ngOnInit(): void {
    this.getGameShelf();
    this.trending();
    this.random();
  }

  getGameShelf() {
    this.gameShelfApi.getGameShelf().subscribe((gameShelf) => {
      if (gameShelf.owner) {
        this.gameShelf = gameShelf;
      }
    });
  }

  trending() {
    this.gameApi.orderBy('rank').subscribe((trendingGames) => {
      this.trendingGames = trendingGames;
    });
  }

  random() {
    this.gameApi.orderBy('random').subscribe((randomGames) => {
      this.randomGames = randomGames;
    });
  }

  search() {
    if (this.value && this.value.trim() != '') {
      this.gameApi.search(this.value).subscribe((search) => {
        this.searchGames = search.games;
        this.currentSearchCount = 1;
        this.maxSearchCount = search.count;
      });
      this.searched = true;
    }
  }

  clearSearch() {
    this.searchGames = null;
    this.value = '';
    this.searched = false;
  }

  addGameToShelf(game: Game) {
    this.gameShelfApi.addGameToShelf(game).subscribe((gameShelf) => {
      if (
        gameShelf &&
        this.gameShelf &&
        gameShelf.games.findIndex((g) => g.bggGameId == game.bggGameId) != -1
      ) {
        this.gameShelf.games.push(game);
      }
    });
  }

  isGameInShelf(game: Game): boolean {
    if (
      this.gameShelf &&
      this.gameShelf.games.findIndex((g) => g.bggGameId == game.bggGameId) != -1
    ) {
      return true;
    }
    return false;
  }

  removeFromShelf(gameId: string) {
    this.gameShelfApi.removeGameFromShelf(gameId).subscribe((game) => {
      if (game && this.gameShelf) {
        this.gameShelf.games = this.gameShelf?.games.filter(
          (game) => game.bggGameId !== gameId
        );
      }
    });
  }
}
