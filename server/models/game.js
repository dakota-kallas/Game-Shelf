class Game {
  constructor(
    id,
    name,
    rating,
    image,
    thumbnail,
    minPlayers,
    maxPlayers,
    year,
    playtime,
    plays,
    rank,
    trendingRank,
    description,
    minAge,
    rules,
    publisher
  ) {
    this._id = id;
    this.name = name;
    this.rating = rating;
    this.image = image;
    this.thumbnail = thumbnail;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.year = year;
    this.playtime = playtime;
    this.plays = plays;
    this.rank = rank;
    this.trendingRank = trendingRank;
    this.description = description;
    this.minAge = minAge;
    this.rules = rules;
    this.publisher = publisher;
  }
}

module.exports = Game;
