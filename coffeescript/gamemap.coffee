define ['./util', './cell', './items'], (util, Cell, items) ->
    Class.extend 'GameMap',
        initialize: (view) ->
            @width = GAME_MAP_WIDTH
            @height = GAME_MAP_HEIGHT
            @data = this.createCellTable @width, @height, view

        createCellTable: (width, height, view) ->
            data = []
            for y in [0...height]
                row = []
                for x in [0...width]
                    row.push Cell.create(x, y, view)
                data.push row
            return data

        positionOutOfBounds: (pos) ->
            return (pos.x < 0 || pos.x > @width ||
                    pos.y < 0 || pos.y > @height)

        get: (position) ->
            @data[position.y][position.x]

        getRandomDirection: ->
            ['left','right','up','down'][util.getRandomInt(0, 4)]

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
                @get(position).addItem items.Water.create()
