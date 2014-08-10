var Creature = GameObject.extend('Creature', {
    objectType: 'creature',
    canOperateDoors: false,

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
    objectType: 'player',
    canOperateDoors: true,

    chopTree: function() {
        this.cell.contents.forEach(function(item) {
            if (item.objectType == 'tree') {
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
            this.addInventory(item.objectType);
        }
    },

    lightFlame: function() {
        this.cell.addItem(Flame.create());
    },

    placeWall: function() {
        this.cell.addItem(WoodWall.create());
    },

    placeDoor: function() {
        this.cell.addItem(WoodDoor.create());
    }
});

var Ammonite = Creature.extend('Ammonite', {
    objectType: 'ammonite'
});
