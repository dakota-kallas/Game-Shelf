export interface Game {
  _id: String;
  name: String | undefined;
  rating: number | undefined;
  image: String | undefined;
  minPlayers: number | undefined;
  maxPlayers: number | undefined;
  year: number | undefined;
}
