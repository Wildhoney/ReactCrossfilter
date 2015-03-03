/** @jsx React.DOM */

(function main($document) {

    "use strict";

    /**
     * @module ReactCrossfilterExample
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ReactCrossfilter
     */
    var ReactCrossfilterExample = React.createClass({

        /**
         * @property mixins
         * @type {Array}
         */
        mixins: [ReactCrossfilter],

        /**
         * @property getDefaultProps
         * @return {Object}
         */
        getDefaultProps: function getDefaultProps() {
            return { teams: [] };
        },

        /**
         * @method componentWillMount
         * @return {void}
         */
        componentWillMount: function componentWillMount() {

            var crossfilter = this.crossfilter('teams', ['name', 'points']),
                forceUpdate = this.forceUpdate.bind(this);

            fetch('/english-premier-league.json').then(function then(response) {
                return response.json();
            }).then(function then(teams) {
                teams.forEach(function forEach(team) { crossfilter.add(team); });
                forceUpdate();
            });

        },

        /**
         * @method teamsBeginningWith
         * @param {String} letter
         * @return {Array}
         */
        teamsBeginningWith: function teamsBeginningWith(letter) {
            letter = letter || 'O';
            return this.state.teams.filter('name', function(d) {
                return d.startsWith(letter.toUpperCase());
            }).all();
        },

        /**
         * @method championsLeagueTeams
         * @return {Array}
         */
        championsLeagueTeams: function championsLeagueTeams() {
            return this.state.teams.sort('points').all(4).map(function map(d) {
                return d.name;
            });
        },

        /**
         * @method europaLeagueTeams
         * @return {Array}
         */
        europaLeagueTeams: function europaLeagueTeams() {
            return this.state.teams.sort('points').all([5, 5]).map(function map(d) {
                return d.name;
            });
        },

        /**
         * @method relegationTeams
         * @return {Array}
         */
        relegationTeams: function relegationTeams() {
            return this.state.teams.sort('points', false).all(3).reverse().map(function map(d) {
                return d.name;
            });
        },

        /**
         * @method changeLetter
         * @return {void}
         */
        changeLetter: function changeLetter(event) {
            this.setState({ startLetter: event.target.value.toUpperCase() });
        },

        /**
         * @method render
         * @return {String}
         */
        render: function render() {

            var styleObject = { display: this.state.startLetter ? 'block' : 'none' };

            return <section>
                       <div>Champions League: {this.championsLeagueTeams().join(', ')}</div>
                       <div>Europa League: {this.europaLeagueTeams().join(', ')}</div>
                       <div>Relegation: {this.relegationTeams().join(', ')}</div>
                       <div style={styleObject}>Teams beginning with "{this.state.startLetter}":
                            {this.teamsBeginningWith(this.state.startLetter).length} of {this.state.teams.size()}</div>
                       <input type="text" placeholder="Beginning with letter..." value={this.state.startLetter} onChange={this.changeLetter} />
                   </section>

        }

    });

    // You can't have done. Manuscripts don't burn.
    var reactCrossfilterNode = $document.querySelector('*[is="react-crossfilter"]');
    React.render(<ReactCrossfilterExample />, reactCrossfilterNode);

})(window.document);