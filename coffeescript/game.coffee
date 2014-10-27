define ['./gamemap', './player'], (GameMap, Player) ->
    Class.extend 'Game',
        initialize: (htmlView) ->
            @view = htmlView
            @map = GameMap.create @view
            @player = Player.create @view
            @creatures = []

        start: ->
            @view.initializeMap @map.data
            setInterval @tick.bind(this), 1500

        tick: ->
            creature.act this for creature in @creatures when creature.act?

        placeCreature: (creature, position) ->
            @creatures.push creature
            @map.placeCreature creature, position

        tryCreatureMove: (creature, dir) ->
            newCell = @map.getMoveCell creature.cell, dir

            if newCell and @creatureCanEnterCell(creature, newCell)
                creature.move newCell
            else
                false

        creatureCanEnterCell: (creature, cell) ->
            if not cell.isPassable()
                return false
            else if cell.hasDoor() and !creature.canOperateDoors
                return false
            else
                return true
