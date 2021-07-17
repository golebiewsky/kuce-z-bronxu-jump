# Kuce z Bronxu Jump
Game inspired by [Jakub 'Dem' Dębski](https://www.demland.net/) series [Kuce z Bronxu](https://youtube.com/playlist?list=PL7k8nNY9B5LwQ7kwoB0ZoZmaVqrWEPd0o) written in [KaBoom.js](https://kaboomjs.com/).


## Running the game
To run the game you will need a webserver. There is a great article on [Phaser website](https://phaser.io/tutorials/getting-started-phaser3/part2) on how to do this and why it is needed.

### Python
One of the ways to run the webserver is to use Python [http.server](https://docs.python.org/3/library/http.server.html) module. Make sure you have [Python](https://www.python.org/downloads/) installed and go to the directory with the `index.html` file and type:
```
python -m http.server
```
And then open [http://localhost:8000/](http://localhost:8000/) in the browser.

## Game structure
* `index.html` - barebones html file, which loads Kaboom.js (and its plugins) from CDN and runs the game script `src/game.js`
* `src/game.js` - script with the whole game
* `assets/` - game sprites and audio files
