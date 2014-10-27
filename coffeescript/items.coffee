define ['./item'], (Item) ->
    Apple: Item.extend 'Apple',
        objectType: 'apple'

    Tree: Item.extend 'Tree',
        objectType: 'tree'

    Water: Item.extend 'Water',
        objectType: 'water'
        impassable: true

    Flame: Item.extend 'Flame',
        objectType: 'flame'

    WoodWall: Item.extend 'WoodWall',
        objectType: 'wood-wall'
        impassable: true

    WoodDoor: Item.extend 'WoodDoor',
        objectType: 'wood-door'
