window.GameMap = Class.extend 'GameMap',
    initialize: (view) ->
        @width = GAME_MAP_WIDTH
        @height = GAME_MAP_HEIGHT
        @data = Cell.createCellTable @width, @height, view

    positionOutOfBounds: (pos) ->
        return (pos.x < 0 || pos.x > @width ||
                pos.y < 0 || pos.y > @height)

    get: (position) ->
        @data[position.y][position.x]

    getRandomDirection: ->
        ['left','right','up','down'][getRandomInt(0, 4)]

    positionChanges:
        left: [-1, 0]
        right: [1, 0]
        up: [0, -1]
        down: [0, 1]

    calculateNewPosition: (position, change) ->
        x: position.x + change[0]
        y: position.y + change[1]

    getMoveCell: (cell, dir) ->
        change = @positionChanges[dir]
        newPos = @calculateNewPosition cell.position, change
        return false if @positionOutOfBounds(newPos)
        return @get newPos

    placeCreature: (creature, position) ->
        cell = @get position
        creature.cell = cell
        creature.cell.creatureEnter creature

    drawRiver: (start, path) ->
        position = {x: start.x, y: start.y}

        path.forEach (step) =>
            ({
                'r': -> position.y++
                'u': -> position.x--
                'l': -> position.y--
                'd': -> position.x++
            })[step]()
            @get(position).addItem Water.create()

window.Cell = Class.extend 'Cell',
    initialize: (x, y, view) ->
        @position = {x: x, y: y}
        @contents = []
        @view = view

    createCellTable: (width, height, view) ->
        data = []
        for y in [0...height]
            row = []
            for x in [0...width]
                row.push Cell.create(x, y, view)
            data.push row
        return data

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
