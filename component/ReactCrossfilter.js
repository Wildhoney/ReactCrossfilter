(function($window) {

    "use strict";

    /**
     * @method ReactCrossfilter
     * @param {String} name
     * @param {Object} properties
     * @constructor
     */
    function ReactCrossfilter(properties) {

        // Instantiate our Crossfilter!
        this.crossfilter   = crossfilter([]);
        this.dimensions    = [];
        this.sortProperty  = properties[0];
        this.sortAscending = true;

        /**
         * @method create
         * @param {Object} d
         * @return {*}
         */
        var create = function create(d) {
            return d[this];
        };

        for (var property in properties) {

            // Iterate over each property to create a related dimension.
            if (properties.hasOwnProperty(property)) {

                var propertyName = properties[property];
                this.dimensions[propertyName] = this.crossfilter.dimension(create.bind(propertyName));

            }

        }

    }

    ReactCrossfilter.prototype = {

        /**
         * @property previous
         * @type {String}
         */
        previous: '',

        /**
         * @method filter
         * @param {String} propertyName
         * @param {Function} filterFn
         * @return {ReactCrossfilter}
         */
        filter: function filter(propertyName, filterFn) {
            var d = this.dimensions[propertyName];
            d.filterFunction(filterFn);
            d.top(Infinity);
            this.previous = propertyName;
            return this;
        },

        /**
         * @method top
         * @param {String} propertyName
         * @param {Number} limit
         * @return {ReactCrossfilter}
         */
        top: function top(propertyName, limit) {
            this.dimensions[propertyName].top(limit);
            return this;
        },

        /**
         * @method sort
         * @param {String} propertyName
         * @param {Boolean} isAscending
         * @return {ReactCrossfilter}
         */
        sort: function sort(propertyName, isAscending) {
            this.sortProperty  = propertyName;
            this.sortAscending = (typeof isAscending === 'undefined') ? true: isAscending;
            return this;
        },

        /**
         * @method all
         * @param {Number} limit
         * @param {Number} offset
         * @return {Array}
         */
        all: function all(limit, offset) {

            if (Array.isArray(limit)) {
                offset = limit[1];
                limit  = limit[0];
            }

            limit = (typeof limit === 'undefined') ? Infinity : limit;
            var direction  = (this.sortAscending) ? 'top' : 'bottom',
                collection = this.dimensions[this.sortProperty][direction](limit);

            if (this.previous) {

                // Reset the previous dimension.
                this.dimensions[this.previous].filterAll();

            }

            if (typeof offset !== 'undefined') {

                return collection.filter(function(d, i) {
                    return (i + 1) >= offset && (i + 1) <= offset;
                });

            }
            
            return collection;
            
        },

        /**
         * @method add
         * @param {Array} models
         * @return {void}
         */
        add: function add(models) {
            this.crossfilter.add(Array.isArray(models) ? models : [models]);
        },

        /**
         * @method size
         * @return {Number}
         */
        size: function size() {
            return this.crossfilter.size();
        }

    };

    /**
     * @module ReactCrossfilter
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ReactCrossfilter
     */
    var ReactCrossfilterMixin = {

        /**
         * Responsible for instantiating our Crossfilter collection, and setting the state
         * object to reflect the new Crossfilter.
         *
         * @method crossfilter
         * @param {String} name
         * @param {Object} properties
         * @return {ReactCrossfilter}
         */
        crossfilter: function crossfilter(name, properties) {
            var stateObject   = this.state || {};
            stateObject[name] = new ReactCrossfilter(properties);
            this.setState(stateObject);
            return stateObject[name];
        },

        /**
         * @method componentWillMount
         * @return {void}
         */
        componentWillMount: function componentWillMount() {

            /**
             * @method throwException
             * @param {String} message
             * @return {void}
             */
            var throwException = function throwException(message) {
                throw 'ReactCrossfilter: ' + message + '.';
            };

        }

    };

    // Export the module as a CommonJS module if possible.
    if (typeof module !== 'undefined' && module !== null) {
        module.exports = ReactCrossfilterMixin;
        return;
    }

    $window.ReactCrossfilter = ReactCrossfilterMixin;

})(window);