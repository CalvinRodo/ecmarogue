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