window.Class =
    constructor: { name: 'Class' }

    extend: (name, properties = {}) ->
        properties.constructor = { name: name }

        obj = Object.create this
        for own name of properties
            obj[name] = properties[name]

        return obj

    create: ->
        obj = Object.create this
        obj.initialize.apply obj, arguments
        return obj

    initialize: ->
