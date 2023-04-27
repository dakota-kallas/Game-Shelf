export interface Game {
  bgaGameId: string;
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
  trendingRank: number | undefined;
  description: string | undefined;
  minAge: number | undefined;
  rules: string | undefined;
  publisher: string | undefined;
}
