## mongoose-load-list

Easy queries with mongoose. Provides two methods `.load()` and `.list()` to query collections. Because chaining a lot of methods everywhere is not efficient.

## Installation

```sh
$ npm install mongoose-load-list
```

## API

```js
var loadList = require('mongoose-load-list');
var Post = new Schema({ ... });
Post.plugin(loadList, options);
```

Make sure any statics you write in your model is done via function call and not with assignment. When the statics are assigned, the .load and .list will be overridden.

## Options

You can pass default options

- `criteria` - default criteria
- `sort` - default sort
- `select` - default fields
- `limit` - default limit
- `populate` - default populated fields

These options are always applied on all the `.load` and `.list` methods. It can be overridden like below.

Example:

```js
var Post = mongoose.model('Post');
var options = {
  select: 'title body created_at user',
  criteria: {
    _id: this.params.id
    // more criterias
  },
  sort: {
    title: -1
  },
  limit: 10,
  skip: 10,     // useful for pagination
  populate: [
    { path: 'users', select: 'name email' }
  ],
  lean: true,   // only for list methods
}
```

## .load(options)

does a `.findOne` on Post collection with all the options passed

```js
yield Post.load(options);
```

## .list(options)

does a `.find` on Post collection with all the options passed

```js
yield Post.list(options);
```

## License

MIT

