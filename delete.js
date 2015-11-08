var debug = require('debug')('loopback:mixins:delete-mixin'),
    assign = require('lodash.assign');

module.exports = function (Model, options) {
    var options = options || {};

    debug('Delete mixin for Model %s', Model.modelName);

    options = assign({ deletedAt: 'deletedAt', required: false }, options);

    debug('options', options);

    Model.defineProperty(options.deletedAt, {type: Date, required: options.required});

    debugger;

    Model.softDeleteById = function (id, next) {
        var idName = Model.definition.idName(),
            context = {
                Model: Model,
                where: {}
            };

        context.where[idName] = id;

        Model.notifyObserversOf('before soft delete', context, function(err) {
            if (err) return cb(err);

            Model.updateAll(context.where, {deletedAt: new Date()}, function (err, info) {
                if (err) return cb(err);

                context.instance = info;

                Model.notifyObserversOf('after soft delete', context, function(err) {
                    next(err, info.count);
                });
            });
        });
    };

    Model.remoteMethod('softDeleteById', {
        description: 'Soft delete a model instance by id from the data source.',
        accessType: 'WRITE',
        accepts: {arg: 'id', type: 'any', description: 'Model id', required: true, http: {source: 'path'}},
        http: {verb: 'del', path: '/soft/:id'},
        returns: {arg: 'count', type: 'object', root: true}
    });

    Model.observe('before delete', function (ctx, next) {
        next('Use soft delete instead of delete.');
    });

    Model.scope('existing', {
        "where": {
            "deletedat": null
        }
    });
};