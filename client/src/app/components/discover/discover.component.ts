import { Component } from '@angular/core';
import { GameshelfService } from 'src/app/services/gameshelf.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent {
  constructor(private gameShelfApi: GameshelfService) {}
  discover() {
    console.log('Called!');
    this.gameShelfApi.test().subscribe(() => {});
  }
}
