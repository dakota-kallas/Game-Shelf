export interface GameLog {
  _id: string;
  owner: string;
  bgaGameId: string;
  date: string;
  note: string | undefined;
  rating: number | undefined;
}
