ITEM_IMAGENAMES =
    'water': 'aquarius-500'
    'apple': 'shiny-apple-500'
    'lumber': 'wood-pile-500'
    'tree': 'beech-500'
    'flame': 'flame-500'
    'ammonite': 'ammonite-500'
    'player': 'cowled-500'
    'wood-wall': 'wood-planks'
    'wood-door': 'wooden-door-2'


define ->
    Class.extend 'HtmlView',
        initialize: ->
            @map = document.getElementById 'game-map'
            @inventory = document.getElementById 'inventory'
            @dialogue = document.getElementById 'dialogue'
            @keybar = document.getElementById('keybar').children[0]
            @viewer = document.getElementById 'viewer'

        initializeMap: (mapData) ->
            mapData.forEach (row) =>
                htmlRow = document.createElement 'tr'

                row.forEach (cell) =>
                    # some roundabout bullshit because you can't
                    # fix height of td's
                    element = document.createElement 'td'
                    inner = document.createElement 'div'
                    inner.classList.add 'inner'
                    cell.element = inner
                    inner.cell = cell
                    element.appendChild inner
                    htmlRow.appendChild element

                @map.appendChild htmlRow

        populateKeybar: (keymaps) ->
            tmpl = _.template $("#keybarTemplate").text()
            for key, command of keymaps
                data = {key: key, command: command}
                $(@keybar).append tmpl(data)

        cellAddItem: (cell, item) ->
            cell.element.classList.add item.objectType
            if @viewer.cell is cell
                @viewCellItems cell

        cellRemoveItem: (cell, item) ->
            cell.element.classList.remove item.objectType
            if @viewer.cell is cell
                @viewCellItems cell

        addInventory: (inventoryItem) ->
            newDiv = document.createElement 'div'
            inventoryItem.element = newDiv
            newDiv.classList.add 'item'
            newDiv.classList.add 'ui'
            newDiv.classList.add inventoryItem.name
            @inventory.appendChild newDiv

        addDialogue: (who, message) ->
            newDiv = document.createElement 'div'
            newDiv.classList.add who
            newDiv.classList.add 'ui'
            newDiv.classList.add 'attached'
            newDiv.classList.add 'segment'
            newDiv.classList.add 'message'
            newDiv.innerText = message
            $(newDiv).transition 'fade down'
            @dialogue.appendChild newDiv

            setTimeout ->
                $(newDiv).transition 'fade out'
            , 10000

        viewCellItems: (cell) ->
            @viewer.cell = cell
            items = cell.contents
            tmpl = _.template $("#viewerTemplate").text()
            $viewer = $(@viewer)

            $viewer.html(
                _.map(items, (item) ->
                    item.imageName = ITEM_IMAGENAMES[item.objectType]
                    return tmpl(item)
                ).join('')
            )
