QUnit.test "Ammonite can't walk through doors", (assert) ->
    game = Game.create()
    ammonite = Ammonite.create()
    cell = Cell.create()
    cell.view = {cellAddItem: -> }
    cell.addItem WoodDoor.create()
    assert.equal(
        game.creatureCanEnterCell ammonite, cell
        false
        "Ammonite walked through door!"
    )

QUnit.test "Player can walk through doors", (assert) ->
    game = Game.create()
    player = Player.create()
    cell = Cell.create()
    cell.view = {cellAddItem: -> }
    cell.addItem WoodDoor.create()
    assert.equal(
        game.creatureCanEnterCell(player, cell)
        true
        "Player couldn't walk through door!"
    )
