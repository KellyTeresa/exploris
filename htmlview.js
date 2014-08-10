var HtmlView = Class.extend('HtmlView', {
    initialize: function() {
        this.map = document.getElementById('game-map');
        this.inventory = document.getElementById('inventory');
        this.dialogue = document.getElementById('dialogue');
        this.keybar = document.getElementById('keybar').children[0];
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

    populateKeybar: function(keymaps) {
        var tmpl = _.template($("#keybarTemplate").text());
        for (key in keymaps) {
            var data = {key: key, command: keymaps[key]};
            $(this.keybar).append(tmpl(data));
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
    }
});
