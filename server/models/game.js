class Game {
  constructor(id, name, rating, image, minPlayers, maxPlayers, year, playtime) {
    this._id = id;
    this.name = name;
    this.rating = rating;
    this.image = image;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.year = year;
    this.playtime = playtime;
  }
}

module.exports = Game;
