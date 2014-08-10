QUnit.test("Ammonite can't walk through doors", function(assert) {
    var game = Game.create();
    var ammonite = Ammonite.create();
    var cell = Cell.create();
    cell.element = {classList: {add: function(){ }}};
    cell.addItem(WoodDoor.create());
    assert.equal(
        game.creatureCanEnterCell(ammonite, cell),
        false,
        "Ammonite walked through door!"
    );
});

QUnit.test("Player can walk through doors", function(assert) {
    var game = Game.create();
    var player = Player.create();
    var cell = Cell.create();
    cell.element = {classList: {add: function(){ }}};
    cell.addItem(WoodDoor.create());
    assert.equal(
        game.creatureCanEnterCell(player, cell),
        true,
        "Player couldn't walk through door!"
    );
});
