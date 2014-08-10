var Item = Class.extend('Item', {
    impassable: false
});

var Apple = Item.extend('Apple', {
    itemType: 'apple'
});

var Tree = Item.extend('Tree', {
    itemType: 'tree'
});

var Water = Item.extend('Water', {
    itemType: 'water',
    impassable: true
});

var Flame = Item.extend('Flame', {
    itemType: 'flame'
});

var WoodWall = Item.extend('WoodWall', {
    itemType: 'wood-wall',
    impassable: true
});

var WoodDoor = Item.extend('WoodDoor', {
    itemType: 'wood-door'
});
