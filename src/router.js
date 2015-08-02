
var App = require('App.jsx');

var Router = require('react-router');
var Route = Router.Route;

var routes = (
    <Route path={"/"} handler={App}>
      <Route path={"inverse-kinematics-solver/"} handler={App}/>
    </Route>
);

module.exports = Router.create({
    routes: routes,
    location: Router.HistoryLocation
});
