export interface Game {
  _id: string;
  year: string;
  name: string | undefined;
  minPlayers: number | undefined;
  maxPlayers: number | undefined;
  age: number | undefined;
  desc: string | undefined;
  img: string | undefined;
}
