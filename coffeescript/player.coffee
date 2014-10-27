define ['./creature'], (Creature) ->
    Creature.extend 'Player',
        objectType: 'player'
        summary: "It's you."
        canOperateDoors: true

        chopTree: ->
            @cell.contents.forEach (item) =>
                if item.objectType is 'tree'
                    @addInventory 'lumber'
                    @cell.removeItem item

                    curses = [
                        "oh my god",
                        "why",
                        "you don't even have an axe",
                        "SWEET JESUS",
                        "HELP HELP I'M BEING REPRESSED",
                        "this is an OUTRAGE",
                        ":-(",
                        "you'd better build me into something AWESOME"
                    ]

                    this.view.addDialogue 'tree', curses[getRandomInt(0, curses.length)]

        getItem: ->
            item = @cell.popItem()
            if item
                @addInventory item.objectType

        lightFlame: ->
            @cell.addItem Flame.create()

        placeWall: ->
            @cell.addItem WoodWall.create()

        placeDoor: ->
            @cell.addItem WoodDoor.create()


