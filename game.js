var GAME_MAP_WIDTH = 25,
    GAME_MAP_HEIGHT = 25,
    PLAYER_START_X = 5,
    PLAYER_START_Y = 5,
    KEY_COMMANDS = {
        'c': 'chopTree'
    }
    ;

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawRiver(start, path, gameMap) {
    var position = {x: start.x, y: start.y};

    path.forEach(function(step) {
        ({
            'r': function(){ position.y++; },
            'u': function(){ position.x--; },
            'l': function(){ position.y--; },
            'd': function(){ position.x++; }
        })[step]();
        gameMap.data[position.x][position.y].addWater();
    });
}

var Player = {
    create: function() {
        var obj = Object.create(Player);

        obj.icon = '<img src="/images/cowled.png" />';
        obj.position = {x: PLAYER_START_X, y: PLAYER_START_Y};
        obj.inventory = [];

        return obj;
    },

    addInventory: function(item) {
        var inventoryItem = {
            name: item
        };

        this.inventory.push(inventoryItem);
        htmlView.addInventory(inventoryItem);
    }
};

var Cell = {
    create: function() {
        var obj = Object.create(Cell);

        obj.isWater = false;
        obj.hasTree = false;

        return obj;
    },

    playerEnter: function(player) {
        this.element.innerHTML = player.icon;
        this.element.classList.add('player');
    },

    playerLeave: function() {
        this.element.innerHTML = '';
        this.element.classList.remove('player');
    },

    addWater: function() {
        this.isWater = true;
        this.element.classList.add('water');
    },

    addTree: function() {
        this.hasTree = true;
        this.element.classList.add('tree');
    },

    killTree: function() {
        this.hasTree = false;
        this.element.classList.remove('tree');
    }
};

var game = {
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
                this.movePlayer(dir);
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
        if (!this.player.cell.hasTree) { return false; }

        this.player.addInventory('lumber');
        this.player.cell.killTree();

        var curses = ['mother piss', 'son of a bitch', 'shit', 'fuck', 'oh god no', 'you don\'t even have a fucking axe'];
        htmlView.addDialogue('tree', curses[getRandomInt(0, curses.length)]);
    },

    createGameMap: function() {
        var gameMap = {
            width: GAME_MAP_WIDTH,
            height: GAME_MAP_HEIGHT,
            positionOutOfBounds: function(pos) {
                return (pos.x < 0 || pos.x > this.width ||
                        pos.y < 0 || pos.y > this.height);
            },
            get: function(position) {
                return this.data[position.y][position.x];
            },
            data: []
        };

        while (gameMap.data.length < gameMap.height) {
            var row = [];

            while (row.length < gameMap.width) {
                row.push(Cell.create());
            }

            gameMap.data.push(row);
        }

        return gameMap;
    },

    movePlayer: function(dir) {
        var change = ({
            'left': [-1, 0],
            'right': [1, 0],
            'up': [0, -1],
            'down': [0, 1]
        })[dir];

        var newPos = calculateNewPosition(this.player.position, change);

        if (this.map.positionOutOfBounds(newPos)) { return false; }

        var newCell = this.map.get(newPos);

        if (newCell.isWater) { return false; }

        if (this.player.cell) {
            this.player.cell.playerLeave();
        }

        this.player.cell = newCell;
        this.player.position = newPos;
        this.placePlayer();
    },

    placePlayer: function() {
        this.player.cell.playerEnter(this.player);
    }
};

function calculateNewPosition(position, change) {
    return {
        x: position.x + change[0],
        y: position.y + change[1]
    };
}

var htmlView = {
    map: document.getElementById('game-map'),

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

    inventory: document.getElementById('inventory'),

    addInventory: function(inventoryItem) {
        var newDiv = document.createElement('div');
        inventoryItem.element = newDiv;
        newDiv.classList.add('inventory-item');
        newDiv.classList.add(inventoryItem.name);
        inventory.appendChild(newDiv);
    },

    dialogue: document.getElementById('dialogue'),

    addDialogue: function(who, message) {
        var newDiv = document.createElement('div');
        newDiv.classList.add(who);
        newDiv.innerHTML = '<p>' + message + '</p>';
        dialogue.appendChild(newDiv);
    }
};

function main() {
    game.map = game.createGameMap();

    game.player = Player.create();

    game.initializeKeyboardListener();

    htmlView.initializeMap(game.map.data);

    game.player.cell = game.map.get(game.player.position);
    game.placePlayer();

    drawRiver(river.start, river.path, game.map);

    trees.forEach(function(position) {
        game.map.get(position).addTree();
    });

    htmlView.addDialogue('player', 'where am I...');
}

main();
