requirejs.config
    shim:
        underscore:
            exports: '_'
    baseUrl: 'javascript'
    paths:
        vendor: '../vendor'
        underscore: '../vendor/underscore'


requirejs ['underscore', './class', 'main']
