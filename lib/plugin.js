var _ = require('underscore');

function Plugin (obj, options) {
  if (!(this instanceof Plugin))
    return new Plugin(obj, options);
    
    this.views = [];
    
    if (obj) {
        this.views = obj.views;
    }

}

module.exports = Plugin;