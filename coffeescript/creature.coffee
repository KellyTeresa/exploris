define ['./gameobject'], (GameObject) ->
    GameObject.extend 'Creature',
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
            cell.creatureEnter this
            this.cell = cell
            cell
