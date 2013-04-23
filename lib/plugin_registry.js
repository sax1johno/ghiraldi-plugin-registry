var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    plugin = require('./plugin'),
    template = require('./template');
    
function PluginRegistry() {
    var plugins = {};

    /* This class is a singleton */
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    arguments.callee._singletonInstance = this;
    
    EventEmitter.call(this);
    
    /** 
     * Add a new plugin to the plugin registry.  If a tag is re-used, the previous plugin
     * is overwritten.
     * @param plugin the plugin to add.
     * @param tag the tag for this plugin (used to retrieve the plugin)
     * @param fn a function that is called when the add is complete.
     * @return the added plugin.
     **/
    this.add = function(tag, plugin, fn) {
        plugins[tag] = plugin;
        this.emit('add', tag, plugin);
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(plugin);   
        }
    };
    
    /**
     * Remove a plugin from the plugin registry.
     * @param tag the tag for the plugin to be removed
     * @param fn a function that is called when the remove is complete.
     * @return true if the delete was successful, false otherwise.
     **/
    this.remove = function(tag, fn) {
        var deleted = plugins[tag];
        this.emit('remove', deleted);
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(deleted);
        }
        return delete plugins[tag];
    };
    
    /**
     * Get a plugin from the plugin registry.
     * @param tag the tag for the plugin.
     * @param fn a function that is called with the plugin requested.
     * @return the requested plugin, or undefined if a plugin with the specified
     *      tag is not found.
     **/
    this.get = function(tag, fn) {
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(plugins[tag]);
        }        
        return plugins[tag];
    };
    
    /** For testing purposes.  Will probably go away soon **/
    this.log = function() {
        return plugins;
    };
    
    /**
     * Get all of the plugins available in the plugin registry.
     * @return the plugin tags.
     **/
    this.getKeys = function() {
        var keys = _.keys(plugins);
        if (!_.isArray(keys)) {
            keys = [keys];
        }
        return keys;
    }
}

PluginRegistry.prototype.__proto__ = EventEmitter.prototype;

module.exports = {
    registry: new PluginRegistry(),
    Plugin: plugin,
    Template: template
};