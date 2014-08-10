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
            if (this.creatureCanEnterCell(creature, newCell)) {
                creature.move(newCell);
            }
        }
    },

    creatureCanEnterCell: function(creature, cell) {
        if (!cell.isPassable()) { return false; }
        if (cell.hasDoor() && !creature.canOperateDoors) { return false; }
        return true;
    }
});
