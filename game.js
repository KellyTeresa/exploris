var GAME_MAP_WIDTH = 25,
    GAME_MAP_HEIGHT = 25,
    PLAYER_START_POSITION = {x: 5, y: 5},
    KEY_COMMANDS = {
        'c': 'chopTree'
    }
    ;

function populateMap(map) {
    var river = {
        start: {x: 8, y: -1},
        path: 'r r r u r r u u u r u r r r u'.split(' ')
    };
    var trees = [
        {x: 1, y: 1},
        {x: 12, y: 13},
        {x: 12, y: 14},
        {x: 11, y: 13},
        {x: 8, y: 4},
        {x: 8, y: 5},
        {x: 9, y: 7},
        {x: 10, y: 6},
        {x: 11, y: 6},
        {x: 10, y: 7},
        {x: 11, y: 7},
        {x: 11, y: 5},
        {x: 12, y: 8},
        {x: 13, y: 5}
    ];
    var apples = [ {x: 6, y: 6} ];
    var ammonites = [ {x: 8, y: 8} ]

    map.drawRiver(river.start, river.path);

    trees.forEach(function(position) {
        map.get(position).addItem('tree');
    });

    apples.forEach(function(position) {
        map.get(position).addItem('apple');
    });

    ammonites.forEach(function(position) {
        map.get(position).addItem('ammonite');
    });
}

function populateDialogue(htmlView) {
    setTimeout(function() {
        htmlView.addDialogue('player', 'where am I..');
    }, 1500);

    setTimeout(function() {
        htmlView.addDialogue('player', 'hello?');
    }, 5000);

    setTimeout(function() {
        htmlView.addDialogue('player', 'this place fuckin sucks');
    }, 15000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var Class = {
    constructor: {name: 'Class'},

    extend: function(name, properties) {
        if(typeof(properties) === 'undefined') properties = {};

        properties.constructor = {name: name};

        var obj = Object.create(this);
        Object.getOwnPropertyNames(properties).forEach(function(name) {
            obj[name] = properties[name];
        });

        return obj;
    },

    create: function() {
        var obj = Object.create(this);
        obj.initialize.apply(obj, arguments);
        return obj;
    },
};

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
    creatureType: 'player'
});

var GameMap = {
    create: function() {
        var map = Object.create(GameMap);
        map.width = GAME_MAP_WIDTH;
        map.height = GAME_MAP_HEIGHT;
        map.data = Cell.createCellTable(map.width, map.height);
        return map;
    },

    positionOutOfBounds: function(pos) {
        return (pos.x < 0 || pos.x > this.width ||
                pos.y < 0 || pos.y > this.height);
    },

    get: function(position) {
        return this.data[position.y][position.x];
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
        if ('water' in newCell.contents) { return false; }
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
            this.get(position).addItem('water');
        }.bind(this));
    }
};

var Cell = {
    create: function(x, y) {
        var cell = Object.create(Cell);
        cell.position = {x: x, y: y};
        cell.contents = {};
        return cell;
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

    addItem: function(name) {
        this.contents[name] = true;
        this.element.classList.add(name);
    },

    removeItem: function(name) {
        delete this.contents[name];
        this.element.classList.remove(name);
    }
};

var Game = {
    create: function(htmlView) {
        var game = Object.create(Game);
        game.view = htmlView;
        game.map = GameMap.create();
        game.player = Player.create(game.view);
        return game;
    },

    start: function() {
        this.initializeKeyboardListener();
        this.view.initializeMap(this.map.data);
        this.map.placeCreature(this.player, PLAYER_START_POSITION)
    },

    initializeKeyboardListener: function(listener) {
        window.addEventListener('keydown', function(event) {
            var moveMapping = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            if (event.keyCode in moveMapping) {
                var dir = moveMapping[event.keyCode];
                this.tryCreatureMove(this.player, dir);
            }

            var mapping = {
                67: 'c'
            };

            if (event.keyCode in mapping) {
                var keyPressed = mapping[event.keyCode];
                var functionName = KEY_COMMANDS[keyPressed];
                this[functionName]();
            }
        }.bind(this), false);
    },

    chopTree: function() {
        if (!('tree' in this.player.cell.contents)) { return false; }

        this.player.addInventory('lumber');
        this.player.cell.removeItem('tree');

        var curses = ['mother piss', 'son of a bitch', 'shit', 'fuck', 'oh god no', 'you don\'t even have a fucking axe'];
        this.view.addDialogue('tree', curses[getRandomInt(0, curses.length)]);
    },

    tryCreatureMove: function(creature, dir) {
        var newCell = this.map.getMoveCell(creature.cell, dir);
        if (newCell) {
            creature.move(newCell);
        }
    }
};

var HtmlView = {
    create: function() {
        var view = Object.create(HtmlView);
        view.map = document.getElementById('game-map');
        view.inventory = document.getElementById('inventory');
        view.dialogue = document.getElementById('dialogue');
        return view;
    },

    initializeMap: function(mapData) {
        mapData.forEach(function(row) {
            var htmlRow = document.createElement('tr');

            row.forEach(function(cell) {
                // some roundabout bullshit because you can't
                // fix height of td's
                var element = document.createElement('td');
                var inner = document.createElement('div');
                inner.classList.add('inner');
                cell.element = inner;
                element.appendChild(inner);
                htmlRow.appendChild(element);
            }.bind(this));

            this.map.appendChild(htmlRow);
        }.bind(this));
    },

    addInventory: function(inventoryItem) {
        var newDiv = document.createElement('div');
        inventoryItem.element = newDiv;
        newDiv.classList.add('inventory-item');
        newDiv.classList.add(inventoryItem.name);
        this.inventory.appendChild(newDiv);
    },

    addDialogue: function(who, message) {
        var newDiv = document.createElement('div');
        newDiv.classList.add(who);
        newDiv.innerHTML = '<p>' + message + '</p>';
        this.dialogue.appendChild(newDiv);
    }
};

function main() {
    var htmlView = HtmlView.create();
    var game = Game.create(htmlView);

    game.start();

    populateMap(game.map);
    populateDialogue(htmlView);
}

main();
