window.Item = GameObject.extend 'Item',
    objectType: 'item',
    impassable: false

window.Apple = Item.extend 'Apple',
    objectType: 'apple'

window.Tree = Item.extend 'Tree',
    objectType: 'tree'

window.Water = Item.extend 'Water',
    objectType: 'water'
    impassable: true

window.Flame = Item.extend 'Flame',
    objectType: 'flame'

window.WoodWall = Item.extend 'WoodWall',
    objectType: 'wood-wall'
    impassable: true

window.WoodDoor = Item.extend 'WoodDoor',
    objectType: 'wood-door'
