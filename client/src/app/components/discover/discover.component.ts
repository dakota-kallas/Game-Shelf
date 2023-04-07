import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
  searchGames: Game[] | undefined;
  popularGames: Game[] | undefined;
  trendingGames: Game[] | undefined;
  searched: Boolean = false;
  @Input() value: string | undefined;

  constructor(private gameApi: GameService) {}

  ngOnInit(): void {
    this.popular();
    this.trending();
  }

  popular() {
    this.gameApi.orderBy('rank').subscribe((popularGames) => {
      this.popularGames = popularGames;
    });
  }

  trending() {
    this.gameApi.orderBy('trending').subscribe((trendingGames) => {
      this.trendingGames = trendingGames;
    });
  }

  search() {
    if (this.value && this.value.trim() != '') {
      this.gameApi.search(this.value).subscribe((searchGames) => {
        this.searchGames = searchGames;
      });
      this.searched = true;
    }
  }
}
