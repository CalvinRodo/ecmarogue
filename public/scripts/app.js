(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require('./lib/player.js');    
var Pedro = require('./lib/pedro.js');

var Game = {
    display: null,
    map: {},
    engine: null,
    player: null,
    pedro: null,
    ananas: null,
    
    init: function() {
        this.display = new ROT.Display({spacing:1.1});
        document.body.appendChild(this.display.getContainer());
        
        this._generateMap();
        
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);

        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
    
    _generateMap: function() {
        var digger = new ROT.Map.Digger();
        var freeCells = [];
        
        var digCallback = function(x, y, value) {
            if (value) { return; }
            
            var key = x+","+y;
            this.map[key] = ".";
            freeCells.push(key);
        }
        digger.create(digCallback.bind(this));
        
        this._generateBoxes(freeCells);
        this._drawWholeMap();
        
        this.player = this._createBeing(Player, freeCells);
        this.pedro = this._createBeing(Pedro, freeCells);
    },
    
    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        console.log(this);
        return new what(x, y, this);
    },
    
    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            if (!i) { this.ananas = key; } /* first box contains an ananas */
        }
    },
    
    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key]);
        }
    }
};



Game.init();
},{"./lib/pedro.js":2,"./lib/player.js":3}],2:[function(require,module,exports){
var Pedro = function(x, y, game) {
    this._x = x;
    this._y = y;
    this._game = game;
    this.__proto__.getSpeed = function() { return 100; }
    
    this.__proto__.act = function() {
        var self = this;
        var x = self._game.player.getX();
        var y = self._game.player.getY();

        var passableCallback = function(x, y) {
            return (x+","+y in self._game.map);
        }
        var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

        var path = [];
        var pathCallback = function(x, y) {
            path.push([x, y]);
        }
        astar.compute(this._x, this._y, pathCallback);

        path.shift();
        if (path.length == 1) {
            this._game.engine.lock();
            alert("this._game over - you were captured by Pedro!");
        } else {
            x = path[0][0];
            y = path[0][1];
            this._game.display.draw(this._x, this._y, this._game.map[this._x+","+this._y]);
            this._x = x;
            this._y = y;
            this._draw();
        }
    }
        
    this.__proto__._draw = function() {
        this._game.display.draw(this._x, this._y, "P", "red");
    }    


    this._draw();
}
    

module.exports = Pedro;
},{}],3:[function(require,module,exports){
module.exports = function(x, y, game) {
    console.log(game);
    this._x = x;
    this._y = y;
    this._game = game;

    this.__proto__.getSpeed = function() { return 100; }
    this.__proto__.getX = function() { return this._x; }
    this.__proto__.getY = function() { return this._y; }

    this.__proto__.act = function() {
        this._game.engine.lock();
        window.addEventListener("keydown", this);
    }
        
    this.__proto__.handleEvent = function(e) {
        var code = e.keyCode;
        if (code == 13 || code == 32) {
            this._checkBox();
            return;
        }

        var keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;

        /* one of numpad directions? */
        if (!(code in keyMap)) { return; }

        /* is there a free space? */
        var dir = ROT.DIRS[8][keyMap[code]];
        var newX = this._x + dir[0];
        var newY = this._y + dir[1];
        var newKey = newX + "," + newY;
        if (!(newKey in this._game.map)) { return; }

        this._game.display.draw(this._x, this._y, this._game.map[this._x+","+this._y]);
        this._x = newX;
        this._y = newY;
        this._draw();
        window.removeEventListener("keydown", this);
        this._game.engine.unlock();
    }

    this.__proto__._draw = function() {
        this._game.display.draw(this._x, this._y, "@", "#ff0");
    }
        
    this.__proto__._checkBox = function() {
        var key = this._x + "," + this._y;
        if (this._game.map[key] != "*") {
            alert("There is no box here!");
        } else if (key == this._game.ananas) {
            alert("Hooray! You found an ananas and won this game.");
            this._game.engine.lock();
            window.removeEventListener("keydown", this);
        } else {
            alert("This box is empty :-(");
        }
    }
    this._draw();
}

},{}]},{},[1])