
var assert = require('assert');
var control = require('form-control');
var parse = require('..');

describe('parse(form, [transformer])', function () {
  describe('simple', function () {
    var form = document.getElementById('simple');
    var data = parse(form);

    it('should parse all the inputs', function () {
      assert.deepEqual(data, {
        username: 'dominicbarnes',
        password: '123456'
      });
    });
  });

  describe('unsubmittable', function () {
    var form = document.getElementById('unsubmittable');
    var data = parse(form);

    it('should return an empty object (sanity check)', function () {
      assert.deepEqual(data, {});
    });

    it('should ignore disabled fields', function () {
      assert(!data.username);
    });

    it('should ignore other unsubmittable types', function () {
      assert(!data.sub);
      assert(!data.btn);
      assert(!data.img);
    });

    it('should ignore fields that are missing a name attribute', function () {
      assert(!data['']);
    });
  });

  describe('nested fields', function () {
    var form = document.getElementById('nested');
    var data = parse(form);

    it('should support nesting fields when separated by dots', function () {
      assert.deepEqual(data.user, {
        id: 'abc123',
        name: 'Dominic Barnes'
      });
    });

    it('should not clobber other fields', function () {
      assert.equal(data.counter, 5);
    });
  });

  describe('transforming values during parse', function () {
    var form = document.getElementById('transform');
    var data = parse(form, function (name, value) {
      switch (name) {
      case 'number': return parseFloat(value);
      case 'empty': return null;
      default: return value;
      }
    });

    it('should transform values correctly', function () {
      assert.strictEqual(data.username, 'testuser');
      assert.strictEqual(data.number, 1.23);
      assert.strictEqual(data.empty, null);
    });
  });

  describe('fieldsets', function () {
    var form = document.getElementById('nested');
    var fieldset = control(form, 'user');

    it('should only parse the controls in the fieldset', function () {
      var data = parse(fieldset);

      assert.deepEqual(data, {
        user: {
          id: 'abc123',
          name: 'Dominic Barnes'
        }
      });
    });
  });
});
