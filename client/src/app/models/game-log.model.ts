export interface GameLog {
  _id: string;
  owner: string;
  bggGameId: string;
  bgaGameName: string;
  date: string;
  note: string | undefined;
  rating: number | undefined;
}
