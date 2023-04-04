import { Component, Input } from '@angular/core';
import { Game } from 'src/app/models/game.model';
import { GameshelfService } from 'src/app/services/gameshelf.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent {
  games: Game[] | undefined;
  @Input() search: string | undefined;

  constructor(private gameShelfApi: GameshelfService) {}

  discover() {
    this.gameShelfApi.search().subscribe((games) => {
      this.games = games;
    });
  }
}
