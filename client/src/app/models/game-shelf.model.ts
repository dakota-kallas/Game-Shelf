import { Game } from './game.model';

export interface GameShelf {
  _id: string;
  owner: string;
  games: Game[];
}
