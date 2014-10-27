window.GAME_MAP_WIDTH = 100
window.GAME_MAP_HEIGHT = 100
window.PLAYER_START_POSITION = {x: 25, y: 15}

window.KEY_COMMANDS =
    'c': 'chopTree'
    'g': 'getItem'
    'f': 'lightFlame'
    'w': 'placeWall'
    'd': 'placeDoor'


initializeCreatures = (game, Ammonite) ->
    game.placeCreature game.player, PLAYER_START_POSITION

    ammonitePos = {x: 8, y: 8}
    ammonite = Ammonite.create game.view
    game.placeCreature ammonite, ammonitePos


populateMap = (map, items) ->
    river =
        start: {x: 8, y: -1}
        path: 'r r r u r r u u u r u r r r u'.split(' ')

    trees = [
        {x: 1, y: 1}
        {x: 12, y: 13}
        {x: 12, y: 14}
        {x: 11, y: 13}
        {x: 8, y: 4}
        {x: 8, y: 5}
        {x: 9, y: 7}
        {x: 10, y: 6}
        {x: 11, y: 6}
        {x: 10, y: 7}
        {x: 11, y: 7}
        {x: 11, y: 5}
        {x: 12, y: 8}
        {x: 13, y: 5}
    ]

    apples = [ {x: 6, y: 6} ]

    map.drawRiver river.start, river.path

    trees.forEach (position) ->
        map.get(position).addItem(items.Tree.create())

    apples.forEach (position) ->
        map.get(position).addItem(items.Apple.create())


populateDialogue = (htmlView) ->
    setTimeout ->
        htmlView.addDialogue 'player', 'where am I..'
    , 1500

    setTimeout ->
        htmlView.addDialogue 'player', 'hello?'
    , 5000

    setTimeout ->
        htmlView.addDialogue 'player', 'this place fuckin sucks'
    , 15000

    setTimeout ->
        htmlView.addDialogue 'ammonite', 'wonk'
    , 7500


attachKeyboardInput = (keyboardInput, game) ->
    for key, method of KEY_COMMANDS
        player = game.player
        callback = player[method].bind player
        keyboardInput.bindKey key, callback

    ['left', 'right', 'up', 'down'].forEach (dir) ->
        keyboardInput.bindKey dir, ->
            cell = game.tryCreatureMove game.player, dir
            if cell
                game.view.viewCellItems cell


define ['./htmlview', './game', './keyboardInput', './ammonite', './items'], (HtmlView, Game, KeyboardInput, Ammonite, items) ->
    htmlView = HtmlView.create()
    game = Game.create htmlView
    keyboardInput = KeyboardInput.create()

    attachKeyboardInput keyboardInput, game
    keyboardInput.startListening()

    game.start()
    initializeCreatures game, Ammonite

    $('div.inner').on 'mouseover', (event) ->
        element = event.target
        htmlView.viewCellItems element.cell

    $('#game-map').on 'mouseout', (event) ->
        htmlView.viewCellItems game.player.cell

    htmlView.populateKeybar KEY_COMMANDS

    populateMap game.map, items
    populateDialogue htmlView
