# form-parse

[![npm version](https://img.shields.io/npm/v/form-parse.svg)](https://www.npmjs.com/package/form-parse)
[![npm dependencies](https://img.shields.io/david/dominicbarnes/form-parse.svg)](https://david-dm.org/dominicbarnes/form-parse)
[![npm dev dependencies](https://img.shields.io/david/dev/dominicbarnes/form-parse.svg)](https://david-dm.org/dominicbarnes/form-parse#info=devDependencies)
[![build status](https://img.shields.io/travis/dominicbarnes/form-parse.svg)](https://travis-ci.org/dominicbarnes/form-parse)

> Takes a form element and transforms the input values into an object.

**NOTE:** this is the successor to [form-serialize](https://github.com/dominicbarnes/form-serialize),
but it drops component/duo in favor of mako. (uses npm for deps, like browserify)

## Usage

```html
<form id="my-form">
    <input type="hidden" name="id" value="123456">
    <input type="text" name="username" value="dominicbarnes">
</form>
```

```js
var parse = require('form-parse');
var form = document.querySelector('#my-form');

parse(form);
// => { id: '123456', username: 'dominicbarnes' }
```


## API

parse(form, [transformer])

Takes the given `form` element and collects the values of all of the
[submittable](https://github.com/yields/submittable)
elements into a single JS object

Fields can be namespaced by using square bracket notation. For example:

```html
<input type="hidden" name="id" value="1">
<input type="text" name="user[name]" value="dominic">
<input type="url" name="user[website]" value="http://dbarnes.info/">
<input type="checkbox" name="tags[]" value="a" checked>
<input type="checkbox" name="tags[]" value="b">
<input type="checkbox" name="tags[]" value="c" checked>
```

```js
{
  id: "1",
  user: {
    name: "dominic",
    website: "http://dbarnes.info/"
  },
  tags: [ "a", "c" ]
}
```

See [squares](https://www.npmjs.com/package/squares) for documentation about
how square-bracket notation is implemented here.

The `transformer` parameter (a `Function`) can be used to transform the field values during
serialization. (eg: parse numbers, dates, etc) This function receives 3 arguments: the `name`
of the field, the input's `value` and the `element` itself.

```html
<input type="text" name="username" value="testuser">
<input type="number" name="number" value="1.23">
<input type="date" name="date" value="2014-06-25">
<input type="text" name="empty">
```

```js
parse(form, function (name, value, element) {
  switch (name) {
  case "number": return parseFloat(value);
  case "date":   return el.valueAsDate;
  case "empty":  return null;
  default:       return value; // catch-all
  }
});
```

**NOTE:** if using `transformer`, you *should* always return *something*, because the return
value will clobber whatever other value was retrieved.
