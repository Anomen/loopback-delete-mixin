var deprecate = require('util').deprecate,
    deleteMixin = require('./delete-mixin');

module.exports = deprecate(function (app) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    app.loopback.modelBuilder.mixins.define('Delete', deleteMixin);
}, 'DEPRECATED: Use mixinSources, see https://github.com/clarkbw/loopback-ds-timestamp-mixin#mixinsources');