export interface Game {
  bggGameId: string;
  name: string | undefined;
  rating: number | undefined;
  image: string | undefined;
  thumbnail: string | undefined;
  minPlayers: number | undefined;
  maxPlayers: number | undefined;
  year: number | undefined;
  playtime: string | undefined;
  plays: number | undefined;
  rank: number | undefined;
  description: string | undefined;
  minAge: number | undefined;
  rules: string | undefined;
  publisher: string | undefined;
}
