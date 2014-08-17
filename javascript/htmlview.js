var ITEM_IMAGENAMES = {
    'water': 'aquarius',
    'apple': 'shiny-apple',
    'lumber': 'wood-pile',
    'tree': 'beech',
    'flame': 'flame',
    'ammonite': 'ammonite',
    'player': 'cowled',
    'wood-wall': 'wood-planks',
    'wood-door': 'wooden-door-2'
};

var HtmlView = Class.extend('HtmlView', {
    initialize: function() {
        this.map = document.getElementById('game-map');
        this.inventory = document.getElementById('inventory');
        this.dialogue = document.getElementById('dialogue');
        this.keybar = document.getElementById('keybar').children[0];
        this.viewer = document.getElementById('viewer');
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
                inner.cell = cell;
                element.appendChild(inner);
                htmlRow.appendChild(element);
            }.bind(this));

            this.map.appendChild(htmlRow);
        }.bind(this));
    },

    populateKeybar: function(keymaps) {
        var tmpl = _.template($("#keybarTemplate").text());
        for (key in keymaps) {
            var data = {key: key, command: keymaps[key]};
            $(this.keybar).append(tmpl(data));
        }
    },

    cellAddItem: function(cell, item) {
        cell.element.classList.add(item.objectType);
        if (this.viewer.cell == cell) {
            this.viewCellItems(cell);
        }
    },

    cellRemoveItem: function(cell, item) {
        cell.element.classList.remove(item.objectType);
        if (this.viewer.cell == cell) {
            this.viewCellItems(cell);
        }
    },

    addInventory: function(inventoryItem) {
        var newDiv = document.createElement('div');
        inventoryItem.element = newDiv;
        newDiv.classList.add('item');
        newDiv.classList.add('ui');
        newDiv.classList.add(inventoryItem.name);
        this.inventory.appendChild(newDiv);
    },

    addDialogue: function(who, message) {
        var newDiv = document.createElement('div');
        newDiv.classList.add(who);
        newDiv.classList.add('ui');
        newDiv.classList.add('attached');
        newDiv.classList.add('segment');
        newDiv.classList.add('message');
        newDiv.innerText = message;
        $(newDiv).transition('fade down');
        this.dialogue.appendChild(newDiv);

        setTimeout(function() {
            $(newDiv).transition('fade out');
        }, 10000);
    },

    viewCellItems: function(cell) {
        this.viewer.cell = cell;
        var items = cell.contents;
        var tmpl = _.template($("#viewerTemplate").text());
        var $viewer = $(this.viewer);

        $viewer.html(
            _.map(items, function(item) {
                item.imageName = ITEM_IMAGENAMES[item.objectType];
                return tmpl(item);
            }).join('')
        );
    }
});
