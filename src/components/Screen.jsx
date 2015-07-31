'use strict';

var Component = require('Component');
require('./styles/Screen.scss');

import Square from 'js/Square';
import Bone from 'js/Bone';
import Arm from 'js/Arm';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';

var framerate = 5;


export default class Screen extends Component {


  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static defaultProps = {
    width: 820,
    height: 580
  }

  static stores = [
  ]

  state = this.updatedState();

  updatedState() {
  }


  clear() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
  }



  componentDidMount() {
    this.ctx = React.findDOMNode(this.refs.canvas).getContext('2d');

    this.arm = new Arm(100, 100);
    this.arm.draw(this.ctx);
    this.arm.target = new Vec2(400, 400);
    this.square = new Square(390, 390, 20, 20, "rgb(200, 0, 0)");

    var vec = new Vec2(2, 5, 5);

    var mat = new Mat([
        [3, 0, 2],
        [2, 0, -2],
        [0, 1, 1]
      ]);

    setTimeout(this.tick.bind(this), 1000/framerate);

  }

  tick() {
    this.clear();
    this.arm.tick(this.ctx);
    this.square.draw(this.ctx);
    this.arm.draw(this.ctx);
    setTimeout(this.tick.bind(this), 1000/framerate);
  }



  render() {


    return (
      <canvas ref="canvas" 
        className="Screen"
        width={this.props.width}
        height={this.props.height}
        style={{
        marginLeft: -this.props.width/2,
        marginTop: -this.props.height/2
      }}>
      </canvas>
    );
  }
}
