window.Creature = GameObject.extend 'Creature',
    objectType: 'creature'
    canOperateDoors: false

    initialize: (view) ->
        this.inventory = []
        this.view = view

    addInventory: (item) ->
        inventoryItem =
            name: item

        this.inventory.push inventoryItem
        this.view.addInventory inventoryItem

    move: (cell) ->
        this.cell.creatureLeave this
        this.cell = cell
        this.cell.creatureEnter this


window.Player = Creature.extend 'Player',
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


window.Ammonite = Creature.extend 'Ammonite',
    objectType: 'ammonite'
