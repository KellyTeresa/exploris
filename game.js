var Creature = Class.extend('Creature', {
    initialize: function(view) {
        this.inventory = [];
        this.view = view;
    },

    addInventory: function(item) {
        var inventoryItem = {
            name: item
        };

        this.inventory.push(inventoryItem);
        this.view.addInventory(inventoryItem);
    },

    move: function(cell) {
        this.cell.creatureLeave(this);
        this.cell = cell;
        this.cell.creatureEnter(this);
    }
});

var Player = Creature.extend('Player', {
    creatureType: 'player',

    chopTree: function() {
        this.cell.contents.forEach(function(item) {
            if (item.itemType == 'tree') {
                this.addInventory('lumber');
                this.cell.removeItem(item);

                var curses = ['mother piss', 'son of a bitch', 'shit', 'fuck', 'oh god no', 'you don\'t even have a fucking axe'];
                this.view.addDialogue('tree', curses[getRandomInt(0, curses.length)]);
            }
        }.bind(this));
    },

    getItem: function() {
        var item = this.cell.popItem();
        if (item) {
            this.addInventory(item.itemType);
        }
    }
});

var Ammonite = Creature.extend('Ammonite', {
    creatureType: 'ammonite'
});

var GameMap = Class.extend('GameMap', {
    initialize: function() {
        this.width = GAME_MAP_WIDTH;
        this.height = GAME_MAP_HEIGHT;
        this.data = Cell.createCellTable(this.width, this.height);
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
        var newCell = this.get(newPos);
        if (newCell.hasWater()) { return false; }
        return newCell;
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

var Item = Class.extend('Item', {
});

var Apple = Item.extend('Apple', {
    itemType: 'apple'
});

var Tree = Item.extend('Tree', {
    itemType: 'tree'
});

var Water = Item.extend('Water', {
    itemType: 'water'
});

var Cell = Class.extend('Cell', {
    initialize: function(x, y) {
        this.position = {x: x, y: y};
        this.contents = [];
    },

    createCellTable: function(width, height) {
        var data = [];
        for (var y = 0; y < height; y++) {
            var row = [];
            for (var x = 0; x < width; x++) {
                row.push(Cell.create(x, y));
            }
            data.push(row);
        }
        return data;
    },

    creatureEnter: function(creature) {
        this.element.classList.add(creature.creatureType);
    },

    creatureLeave: function(creature) {
        this.element.classList.remove(creature.creatureType);
    },

    addItem: function(item) {
        this.contents.push(item)
        this.element.classList.add(item.itemType);
    },

    removeItem: function(item) {
        var index = this.contents.indexOf(item);
        this.contents.splice(index, 1)
        this.element.classList.remove(item.itemType);
    },

    popItem: function() {
        var item = this.contents[0];
        if (typeof(item) === 'undefined') {
            return null;
        }
        this.removeItem(item);
        return item;
    },

    hasWater: function() {
        var hasWater = false;
        this.contents.forEach(function(item) {
            if (item.itemType == 'water') {
                hasWater = true;
            }
        });
        return hasWater;
    }
});

var KeyboardInput = Class.extend('KeyboardInput', {
    initialize: function() {
        this.bindings = {};
    },

    handleKey: function(event) {
        var mappings = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            67: 'c',
            71: 'g'
        };

        if (event.keyCode in mappings) {
            var keyPressed = mappings[event.keyCode];
            this.bindings[keyPressed]();
        } else {
            console.log("Unknown keypress", event.keyCode);
        }
    },

    startListening: function(listener) {
        window.addEventListener(
            'keydown',
            this.handleKey.bind(this),
            false
        );
    },

    bindKey: function(key, callback) {
        this.bindings[key] = callback;
    }
});

var Game = Class.extend('Game', {
    initialize: function(htmlView) {
        this.view = htmlView;
        this.map = GameMap.create();
        this.player = Player.create(this.view);
        this.creatures = [];
    },

    start: function() {
        this.view.initializeMap(this.map.data);
        this.initializeCreatures();
    },

    initializeCreatures: function() {
        this.map.placeCreature(this.player, PLAYER_START_POSITION);

        // initialize creature(s)
        var ammonite = Ammonite.create(this.view);
        this.map.placeCreature(ammonite, ammonitePos);
        setInterval(function() {
            var dir = this.map.getRandomDirection();
            this.tryCreatureMove(ammonite, dir);
        }.bind(this), 1500);
    },

    tryCreatureMove: function(creature, dir) {
        var newCell = this.map.getMoveCell(creature.cell, dir);
        if (newCell) {
            creature.move(newCell);
        }
    }
});
