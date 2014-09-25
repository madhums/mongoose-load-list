
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

        // _id was passed as options
        // build the criteria for this
        if (method === 'findOne' && typeof options === 'string') {
          criteria._id = options;
          options = {};
        }

        var sort = options.sort || defaults.sort;
        var limit = options.limit === 0
          ? 0
          : (options.limit || defaults.limit);
        var page = options.page || 0;
        var select = options.select || defaults.select;
        var populate = options.populate || [];
        populate = populate.concat(defaults.populate);

        // Always include default criteria
        criteria = extend(criteria, defaults.criteria);

        var list = self[method](criteria)
          .select(select)
          .populate(populate)
          .sort(sort)
          .limit(limit)
          .skip(limit * page);

        if (options.lean) return list.lean().exec(done);
        else return list.exec(done);
      };
    };
  }
};
