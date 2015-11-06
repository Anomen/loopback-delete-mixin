var debug = require('debug')('loopback:mixins:delete-mixin'),
    assign = require('lodash.assign');

module.exports = function (Model, options) {
    var options = options || {};

    debug('TimeStamp mixin for Model %s', Model.modelName);

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", Model.modelName);

    options = assign({ deletedAt: 'deletedAt', required: false }, options);

    debug('options', options);

    Model.defineProperty(options.deletedAt, {type: Date, required: options.required});

    Model.softDelete = function (id, next) {
        Model.updateAll({id: id}, {deletedAt: new Date()});
        next();
    };

    Model.remoteMethod('softDelete', {
        description: 'Delete a model instance by id from the data source.',
        accessType: 'WRITE',
        accepts: {arg: 'id', type: 'any', description: 'Model id', required: true,
            http: {source: 'path'}},
        http: {verb: 'del', path: '/:id'},
        returns: {arg: 'count', type: 'object', root: true}
    });
};