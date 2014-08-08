var GAME_MAP_WIDTH = 25,
    GAME_MAP_HEIGHT = 25,
    PLAYER_START_X = 5,
    PLAYER_START_Y = 5
    ;

var river = {
    start: {x: 8, y: -1},
    path: 'r r r u r r u u u r u r r r u'.split(' ')
};

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

var Cell = {
    create: function() {
        var obj = Object.create(Cell);

        obj.isWater = false;

        return obj;
    },

    playerEnter: function(player) {
        this.htmlCell.innerHTML = player.icon;
        this.htmlCell.classList.add('player');
    },

    playerLeave: function() {
        this.htmlCell.innerHTML = '';
        this.htmlCell.classList.remove('player');
    },

    addWater: function() {
        this.isWater = true;
        this.htmlCell.classList.add('water');
    }
};

var game = {
    initializeKeyboardListener: function(listener) {
        window.addEventListener('keydown', function(event) {
            var mapping = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            if (event.keyCode in mapping) {
                var dir = mapping[event.keyCode];
                this.movePlayer(dir);
            }
        }.bind(this), false);
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
        console.log("move " + dir);
        var change = ({
            'left': [-1, 0],
            'right': [1, 0],
            'up': [0, -1],
            'down': [0, 1]
        })[dir];

        console.log(this.player.position);
        console.log(change);
        var newPos = calculateNewPosition(this.player.position, change);
        console.log(newPos);

        if (this.map.positionOutOfBounds(newPos)) { console.log("ugh no");return false; }

        var newCell = this.map.get(newPos);

        if (newCell.isWater) { console.log("ugh water");return false; }

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

function createListener(gameMap, player) {
    return {
        right: function() {
            if (player.position.y === gameMap.width - 1) { return; }
            player.position.y++;
            game.movePlayer(gameMap, player);
        },
        left: function() {
            if (player.position.y === 0) { return; }
            player.position.y--;
            game.movePlayer(gameMap, player);
        },
        up: function() {
            if (player.position.x === 0) { return; }
            player.position.x--;
            game.movePlayer(gameMap, player);
        },
        down: function() {
            if (player.position.x === gameMap.height - 1) { return; }
            player.position.x++;
            game.movePlayer(gameMap, player);
        }
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
                var htmlCell = document.createElement('td');
                var inner = document.createElement('div');
                inner.classList.add('inner');
                cell.htmlCell = inner;
                htmlCell.appendChild(inner);
                htmlRow.appendChild(htmlCell);
            }.bind(this));

            this.map.appendChild(htmlRow);
        }.bind(this));
    }
};

function main() {
    game.map = game.createGameMap();

    game.player = {
        icon: '<img src="/images/cowled.png" />',
        position: {x: PLAYER_START_X, y: PLAYER_START_Y}
    };

    game.initializeKeyboardListener();

    htmlView.initializeMap(game.map.data);

    game.player.cell = game.map.get(game.player.position);
    game.placePlayer();

    drawRiver(river.start, river.path, game.map);
}

main();
