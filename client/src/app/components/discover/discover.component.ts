import { Component, Input } from '@angular/core';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent {
  games: Game[] | undefined;
  @Input() value: string | undefined;

  constructor(private gameApi: GameService) {}

  search() {
    if (this.value && this.value.trim() != '') {
      this.gameApi.search(this.value).subscribe((games) => {
        this.games = games;
      });
    }
  }
}
