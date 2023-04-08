export interface Game {
  _id: String;
  name: String | undefined;
  rating: number | undefined;
  image: String | undefined;
  thumbnail: String | undefined;
  minPlayers: number | undefined;
  maxPlayers: number | undefined;
  year: number | undefined;
  playtime: String | undefined;
  plays: number | undefined;
  rank: number | undefined;
  trendingRank: number | undefined;
  description: String | undefined;
  minAge: number | undefined;
  rules: String | undefined;
  publisher: String | undefined;
}
