var GameObject = Class.extend('GameObject', {
    objectType: 'game-object',
    summary: 'A thing.'
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
    },

    tryCreatureMove: function(creature, dir) {
        var newCell = this.map.getMoveCell(creature.cell, dir);
        if (newCell) {
            if (this.creatureCanEnterCell(creature, newCell)) {
                creature.move(newCell);
                return newCell;
            }
        }
        return false;
    },

    creatureCanEnterCell: function(creature, cell) {
        if (!cell.isPassable()) { return false; }
        if (cell.hasDoor() && !creature.canOperateDoors) { return false; }
        return true;
    }
});
