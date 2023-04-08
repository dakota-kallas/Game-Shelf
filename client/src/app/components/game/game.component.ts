import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  private static EMPTY_Game = {
    _id: '',
    name: undefined,
    rating: undefined,
    image: undefined,
    minPlayers: undefined,
    maxPlayers: undefined,
    year: undefined,
    playtime: undefined,
  };
  game: Game = Object.assign({}, GameComponent.EMPTY_Game);

  private gameId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameApi: GameService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['gid'];
      this.gameApi.getOne(this.gameId).subscribe((game) => {
        this.game = game;
      });
    });
  }
}
