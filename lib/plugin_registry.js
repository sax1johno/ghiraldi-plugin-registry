var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    plugin = require('./plugin');
    
function PluginRegistry() {
    var plugins = {};

    /* This class is a singleton */
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    arguments.callee._singletonInstance = this;
    
    EventEmitter.call(this);
    
    /** 
     * Add a new schema to the schema registry.  If a tag is re-used, the previous schema
     * is overwritten.
     * @param schema the schema to add.
     * @param tag the tag for this schema (used to retrieve the schema)
     * @return the added schema.
     **/
    this.add = function(tag, plugin, fn) {
        if (!_.isUndefined(fn) && !_.isNull(fn) && _.isFunction(fn)) {
            fn(plugins[tag] = plugin);
        } else {
            plugins[tag] = plugin;
        }
        this.emit('add', tag, plugin);        
    };
    
    /**
     * Remove a schema from the schema registry.
     * @param tag the tag for the schema to be removed
     * @return true if the delete was successful, false otherwise.
     **/
    this.remove = function(tag, fn) {
        var deleted = plugins[tag];
        if (!_.isUndefined(fn) && !_.isNull(fn) && _.isFunction(fn)) {
            fn(delete plugins[tag]);            
        } else {
            return delete plugins[tag];
        }
        this.emit('remove', deleted);
    };
    
    this.get = function(tag, fn) {
        if (_.isUndefined(plugins[tag])) {
            plugins[tag] = new plugin({});
        }
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(plugins[tag]);
        }
        return plugins[tag];
    };
    
    /** For testing purposes.  Will probably go away soon **/
    this.log = function(fn) {
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(plugins);
        }
        return plugins;
    };
    
    this.getKeys = function(fn) {
        var keys = _.keys(plugins);
        if (!_.isArray(keys)) {
            keys = [keys];
        }
        if (!_.isUndefined(fn) && !_.isNull(fn)) {
            fn(keys);      
        }
        return keys;
    }
}

PluginRegistry.prototype.__proto__ = EventEmitter.prototype;

module.exports = {
    registry: new PluginRegistry(),
    Plugin: plugin
};