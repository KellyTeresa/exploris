var GameMap = Class.extend('GameMap', {
    initialize: function(view) {
        this.width = GAME_MAP_WIDTH;
        this.height = GAME_MAP_HEIGHT;
        this.data = Cell.createCellTable(this.width, this.height, view);
    },

    positionOutOfBounds: function(pos) {
        return (pos.x < 0 || pos.x > this.width ||
                pos.y < 0 || pos.y > this.height);
    },

    get: function(position) {
        return this.data[position.y][position.x];
    },

    getRandomDirection: function() {
        return ['left','right','up','down'][getRandomInt(0, 4)];
    },

    positionChanges: {
        'left': [-1, 0],
        'right': [1, 0],
        'up': [0, -1],
        'down': [0, 1]
    },

    calculateNewPosition: function(position, change) {
        return {
            x: position.x + change[0],
            y: position.y + change[1]
        };
    },

    getMoveCell: function(cell, dir) {
        var change = this.positionChanges[dir];
        var newPos = this.calculateNewPosition(cell.position, change);
        if (this.positionOutOfBounds(newPos)) { return false; }
        return this.get(newPos);
    },

    placeCreature: function(creature, position) {
        var cell = this.get(position);
        creature.cell = cell;
        creature.cell.creatureEnter(creature);
    },

    drawRiver: function(start, path) {
        var position = {x: start.x, y: start.y};

        path.forEach(function(step) {
            ({
                'r': function(){ position.y++; },
                'u': function(){ position.x--; },
                'l': function(){ position.y--; },
                'd': function(){ position.x++; }
            })[step]();
            this.get(position).addItem(Water.create());
        }.bind(this));
    }
});

var Cell = Class.extend('Cell', {
    initialize: function(x, y, view) {
        this.position = {x: x, y: y};
        this.contents = [];
        this.view = view;
    },

    createCellTable: function(width, height, view) {
        var data = [];
        for (var y = 0; y < height; y++) {
            var row = [];
            for (var x = 0; x < width; x++) {
                row.push(Cell.create(x, y, view));
            }
            data.push(row);
        }
        return data;
    },

    creatureEnter: function(creature) {
        this.addItem(creature);
    },

    creatureLeave: function(creature) {
        this.removeItem(creature);
    },

    addItem: function(item) {
        this.contents.push(item)
        this.view.cellAddItem(this, item);
    },

    removeItem: function(item) {
        var index = this.contents.indexOf(item);
        this.contents.splice(index, 1)
        this.view.cellRemoveItem(this, item);
    },

    popItem: function() {
        var item = this.contents[0];
        if (typeof(item) === 'undefined') {
            return null;
        }
        this.removeItem(item);
        return item;
    },

    isPassable: function() {
        for (var i = 0; i < this.contents.length; i++) {
            if (this.contents[i].impassable) {
                return false;
            }
        };
        return true;
    },

    hasDoor: function() {
        for (var i = 0; i < this.contents.length; i++) {
            if (this.contents[i].objectType == 'wood-door') {
                return true;
            }
        };
        return false;
    }
});