
/*!
 * mongoose-load-list
 * Copyright(c) 2014 Madhusudhan <madhums8@gmail.com>
 * MIT Licensed
 */

/*!
 * Module dependencies.
 */

var extend = require('util')._extend;

/**
 * Expose
 */

module.exports = function (schema, defaults) {

  // set defaults

  defaults.select = defaults.select || '';
  defaults.criteria = defaults.criteria || {};
  defaults.sort = defaults.sort || {};
  defaults.limit = defaults.limit || 0;
  defaults.skip = defaults.skip || 0;
  defaults.populate = defaults.populate || [];

  // load and list methods

  schema.statics.list = query('find');
  schema.statics.load = query('findOne');

  /**
   * Query
   *
   * @param {Object} options
   * @return {Function} Thunk
   * @api private
   */

  function query (method) {
    return function (options) {
      var self = this;
      options = options || {};

      return function (done) {
        var criteria = options.criteria || {};
        var populate = options.populate || [];

        // allow passing of _id as option
        if (method === 'findOne' && typeof options === 'string') {
          criteria._id = options;
          options = {};
        }

        // merge defaults
        options.select = options.select || defaults.select;
        options.sort = options.sort || defaults.sort;
        options.page = options.page || 0;
        options.limit = options.limit === 0
          ? 0
          : (options.limit || defaults.limit);

        // merge default populate
        populate = populate.concat(defaults.populate);

        // merge default criteria
        criteria = extend(criteria, defaults.criteria);

        var list = self[method](criteria)
          .select(options.select)
          .sort(options.sort)
          .limit(options.limit)
          .skip(options.limit * options.page)
          .populate(populate);

        if (options.lean) return list.lean().exec(done);
        else return list.exec(done);
      };
    };
  }
};
