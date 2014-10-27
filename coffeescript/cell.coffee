define ->
    Class.extend 'Cell',
        initialize: (x, y, view) ->
            @position = {x: x, y: y}
            @contents = []
            @view = view

        creatureEnter: (creature) ->
            @addItem creature

        creatureLeave: (creature) ->
            @removeItem creature

        addItem: (item) ->
            @contents.push item
            @view.cellAddItem this, item

        removeItem: (item) ->
            index = @contents.indexOf item
            @contents.splice index, 1
            @view.cellRemoveItem this, item
            item

        popItem: ->
            item = @contents[0]
            return null if not item?
            @removeItem item

        isPassable: ->
            not @isImpassable()

        isImpassable: ->
            _.any @contents, (item) -> item.impassable

        hasDoor: ->
            _.any @contents, (item) -> item.objectType is 'wood-door'

