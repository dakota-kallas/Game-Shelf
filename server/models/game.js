class Game {
  constructor(id, year, minPlayers, maxPlayers, age, name, desc, img) {
    this._id = id;
    this.year = year;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.age = age;
    this.name = name;
    this.desc = desc;
    this.img = img;
  }
}

module.exports = Game;
