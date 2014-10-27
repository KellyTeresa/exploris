define ['./gamemap', './player'], (GameMap, Player) ->
    Class.extend 'Game',
        initialize: (htmlView) ->
            @view = htmlView
            @map = GameMap.create @view
            @player = Player.create @view
            @creatures = []

        start: ->
            @view.initializeMap @map.data

        tryCreatureMove: (creature, dir) ->
            newCell = this.map.getMoveCell creature.cell, dir

            if newCell and this.creatureCanEnterCell(creature, newCell)
                creature.move newCell
                return newCell
            else
                return false

        creatureCanEnterCell: (creature, cell) ->
            if not cell.isPassable()
                return false
            else if cell.hasDoor() and !creature.canOperateDoors
                return false
            else
                return true
