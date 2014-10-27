define ['./gameobject'], (GameObject) ->
    GameObject.extend 'Item',
        objectType: 'item',
        impassable: false
