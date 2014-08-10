var Item = GameObject.extend('Item', {
    objectType: 'item',
    impassable: false
});

var Apple = Item.extend('Apple', {
    objectType: 'apple'
});

var Tree = Item.extend('Tree', {
    objectType: 'tree'
});

var Water = Item.extend('Water', {
    objectType: 'water',
    impassable: true
});

var Flame = Item.extend('Flame', {
    objectType: 'flame'
});

var WoodWall = Item.extend('WoodWall', {
    objectType: 'wood-wall',
    impassable: true
});

var WoodDoor = Item.extend('WoodDoor', {
    objectType: 'wood-door'
});
