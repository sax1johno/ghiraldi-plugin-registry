var _ = require('underscore'),
    ViewEngine = require('ghiraldi-views-engine').ViewEngine,
    JadeTemplateType = require('ghiraldi-views-engine').JadeTemplate,
    logger = require('ghiraldi-simple-logger'),
    util = require('util');
    
/** 
 * A Plugin represents a separate piece of functionality in a Ghiraldi app.  Ghiraldi
 * apps are generally composed of a number of functional plugins.
 * 
 * Plugins handle, among other things, the rendering of views.
 **/
function Plugin (obj, options) {
  if (!(this instanceof Plugin))
    return new Plugin(obj, options);
    
    this.baseDir = null;
    this.fileName = null;
    this.name = null;
    this.viewEngine = new ViewEngine();
    this.viewEngine.TemplateType = 'jade';

    if (obj) {
        if (obj.viewEngine) {
            this.viewEngine = new obj.viewEngine();
        }
        if (obj.views) {
            this.viewEngine.setViews(obj.views);
        }
        if (obj.templateType) {
            this.viewEngine.TemplateType = obj.templateType;
        }
    } 
    
    var that = this;
    
    this.setView = function(tag, viewFile) {
        that.viewEngine.setView(tag, viewFile);
    };
    
    this.getView = function(viewName, locals, fn) {
        that.viewEngine.getView(viewName, locals, fn);
    };
    
    this.get = function() {
        if (!_.isNull(that.baseDir) 
            && !_.isNull(that.requireFile))
            return require(that.baseDir + '/' + that.fileName);
        return null;
    };

    /**
     * Get a module from within this plugin's base directory.
     * @param modulePath the path to the module. (including the beginning /)
     * @return the complete module path which can be passed to "require"
     **/
    this.getModule = function(path) {
        return that.baseDir + path;
    };
    
}

module.exports = Plugin;