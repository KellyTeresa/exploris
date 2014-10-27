define ['./creature'], (Creature) ->
    Creature.extend 'Ammonite',
        objectType: 'ammonite'

        act: (game) ->
            dir = game.map.getRandomDirection()
            game.tryCreatureMove this, dir

