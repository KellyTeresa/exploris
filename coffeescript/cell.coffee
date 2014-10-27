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

        popItem: ->
            item = @contents[0]
            return null if not item?
            @removeItem item
            return item

        isPassable: ->
            for i in [0...@contents.length]
                return false if @contents[i].impassable
            return true

        hasDoor: ->
            for i in [0...@contents.length]
                return true if @contents[i].objectType is 'wood-door'
            return false

