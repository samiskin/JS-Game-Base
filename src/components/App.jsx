'use strict';

var Component = require('Component');
require('./styles/App.scss');

import Screen from 'Screen.jsx';

export default class App extends Component {


  static propTypes = {
  }

  static defaultProps = {
  }

  static stores = [
  ]

  state = this.updatedState();

  updatedState() {
  }

  render() {
    return (
      <div className="App" >
        <Screen />
      </div>
    );
  }
}
