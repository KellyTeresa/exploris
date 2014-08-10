var Class = {
    constructor: {name: 'Class'},

    extend: function(name, properties) {
        if(typeof(properties) === 'undefined') properties = {};

        properties.constructor = {name: name};

        var obj = Object.create(this);
        Object.getOwnPropertyNames(properties).forEach(function(name) {
            obj[name] = properties[name];
        });

        return obj;
    },

    create: function() {
        var obj = Object.create(this);
        obj.initialize.apply(obj, arguments);
        return obj;
    },

    initialize: function() {}
};

