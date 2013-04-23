var _ = require('underscore'),
    jade = require('jade'),
    fs = require('fs');

function Template(uri) {
  if (!(this instanceof Template))
    return new Template(uri);

    this.cachedTemplateString = "";
    
    this.uri = uri;
    
    this.extend = {};
    
    this.includes = [];
    
    this.load(uri);
    
}

/**
 * Loads the file at the URI into the template string and performs the injections
 * of the extends and includes.
 * @param uri an optional uri that can be used to re-load the template with a new file.
 **/
Template.prototype.load = function(uri, returnFn) {
    if (!_.isUndefined(uri) && !_.isNull(uri)) {
        this.uri = uri;
    }
    
    // Load up the URI into the cached template string.
    this.cachedTemplateString = fs.readFileSync(this.uri, 'utf8');
    
    var includes = [];
    var extend = {};
    
    // Inject the includes and extends into the cachedTemplateString.
    if (!_.isUndefined(this.includes) && !_.isNull(this.includes)) {
        includes = this.includes;
    };
    
    if (!_.isUndefined(this.extend) && !_.isNull(this.extend)) {
        extend = this.extend;
    }
    
    function processExtends() {
        if (!_.isNull(this.extend) && !_.isUndefined(this.extend)) {
            if (!_.isEmpty(this.extend)) {
                var re = new RegExp("extends " + this.extend.name,"g");
                this.cachedTemplateString = this.cachedTemplateString.replace(re, "extends " + this.extend.uri);                
            }
        }
        return processIncludes(0);
    }
        
    function processIncludes(index) {
        if (index < _.size(this.includes) - 1) {
            if(!_.isUndefined(this.includes) && !_.isUndefined(this.includes) && !_.isEmpty(this.includes)) {
                var re = new RegExp("include " + this.includes[index].name,"g");
                this.cachedTemplateString = this.cachedTemplateString.replace(re, "include " + this.includes[index].uri);           
            }
            // Now, call the next one.
            processIncludes(++index);
        } else {
            // Now, return the cachedTemplateString
            if (!_.isNull(returnFn) && !_.isUndefined(returnFn)) {
                returnFn(this.cachedTemplateString);   
            }
            
            return this.cachedTemplateString;            
        }
    }
    
    return processExtends();
};

/**
 * Use this method to dynamically inject layout items into a template.
 * @param obj an object with the layout extensions and inclusions.
 * @param fn a function to be called when injection is complete.
 **/
Template.prototype.inject = function(object) {
    if (!_.isUndefined(object) && !_.isNull(object)) {
        if (!_.isUndefined(object.includes) && !_.isNull(object.includes)) {
            this.includes = object.includes;
        }
        if (!_.isUndefined(object.extend) && !_.isNull(object.extend)) {
            this.extend = object.extend;
        }
    }
};

/**
 * Renders the template with the given locals and calls the return function with
 * the HTML to be rendered.  Can also optionally be given a "response" object from express
 * to render the response.
 * @param res a response object that can render html.
 * @param locals an object with local variables to pass into the template.
 * @param a function that is called when the render is complete.  The function
 * takes an err and html parameter.
 **/
Template.prototype.render = function(res, locals, fn) {
    // first, lets check to see if this is the 2 argument version or the 3 argument version.
    if (_.isFunction(locals)) {
        locals = res;
        fn = locals;
        res = null;
    }
    
    var compileConfig = {};
    compileConfig.filename = '/';
    if (!_.isUndefined(locals) && !_.isNull(locals)) {
        compileConfig.locals = locals;   
    }
    
    if (this.cachedTemplateString === '') {
        this.load(this.uri);
        compileTemplate();
    } else {
        compileTemplate();
    }
    
    function compileTemplate() {
        var compiledTemplate = jade.compile(this.cachedTemplateString, compileConfig);
        console.log("Compiled template: " + compiledTemplate);
        
        // Last part is to render and / or return the template.
        if (!_.isUndefined(res) && !_.isNull(res)) {
            res.send(compiledTemplate);   
        }
        
        if (!_.isUndefiend(fn) && !_.isNull(fn) && _.isFunction(fn)) {
            fn(compiledTemplate);
        }
    }
};

module.exports = Template;