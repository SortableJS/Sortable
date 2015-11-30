'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sortablejs = require('sortablejs');

var _sortablejs2 = _interopRequireDefault(_sortablejs);

exports['default'] = {
  params: ['options', 'eventName'],

  bind: function bind() {
    var self = this;

    this.params.options.onUpdate = function () {
      self.update(this.toArray());
    }, _sortablejs2['default'].create(this.el, this.params.options);
  },

  update: function update(val) {
    if (typeof val === 'undefined') {
      return;
    }

    this.vm.$emit(this.params.eventName, val);
  }
};
module.exports = exports['default'];
