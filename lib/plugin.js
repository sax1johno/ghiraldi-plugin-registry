var _ = require('underscore'),
    Template = require('./template');

/** 
 * A Plugin represents a separate piece of functionality in a Ghiraldi app.  Ghiraldi
 * apps are generally composed of a number of functional plugins.
 * 
 * Plugins handle, among other things, the rendering of views.
 **/
function Plugin (obj, options) {
  if (!(this instanceof Plugin))
    return new Plugin(obj, options);
    
    this.views = {};
    this.baseDir = null;
    this.fileName = null;
    this.name = null;
    
    // Contains a cache of the rendered views.  This eliminates the need for re-building the views
    // on every call.
    this.viewCache = {};
    
    if (obj) {
        this.views = obj.views;
    }
    
    this.getView = function(viewName) {
        if (!_.isUndefined(this.views[viewName]) && !_.isNull(this.views[viewName])) {
            if (!_.isUndefined(this.viewCache[viewName]) && !_.isNull(this.viewCache[viewName])) {
                return this.viewCache[viewName];
            } else {
                this.viewCache[viewName] = new Template(this.views[viewName].uri);
            }
        } else {
            throw "No view found with name " + viewName + " in this plugin";
        }
    };
    
    this.get = function() {
        if (!_.isNull(this.basedir) 
            && !_.isNull(this.requireFile))
            return require(this.baseDir + '/' + this.fileName);
        return null;
    };
    
    /**
     * Get a module from within this plugin's base directory.
     * @param modulePath the path to the module. (including the beginning /)
     * @return the complete module path which can be passed to "require"
     **/
    this.getModule = function(path) {
        return this.baseDir + path;
    }
    
}

module.exports = Plugin;