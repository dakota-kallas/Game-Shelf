class Game {
  constructor(options) {
    this.bggGameId = options.id;
    this.name = options.name;
    this.rating = options.rating;
    this.image = options.image;
    this.thumbnail = options.thumbnail;
    this.minPlayers = options.minPlayers;
    this.maxPlayers = options.maxPlayers;
    this.year = options.year;
    this.playtime = options.playtime;
    this.plays = options.plays;
    this.rank = options.rank;
    this.trendingRank = options.trendingRank;
    this.description = options.description;
    this.minAge = options.minAge;
    this.rules = options.rules;
    this.publisher = options.publisher;
  }
}

module.exports = Game;
