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
    console.log(`Search: ${this.search}`);
    if (this.search && this.search.trim() != '') {
      this.gameShelfApi.search(this.search).subscribe((games) => {
        this.games = games;
      });
    }
  }
}
