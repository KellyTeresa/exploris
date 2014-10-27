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
