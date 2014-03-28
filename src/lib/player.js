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
