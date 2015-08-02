'use strict';

var Component = require('Component');
require('./styles/Screen.scss');

import Bone from 'js/Bone';
import Arm from 'js/Arm';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';

var framerate = 60.0001;


export default class Screen extends Component {


  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static defaultProps = {
    width: 800,
    height: 800
  }

  static stores = [
  ]

  state = this.updatedState();

  updatedState() {
  }

  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouse = new Vec2(evt.clientX - rect.left, evt.clientY - rect.top);
  }

  componentDidMount() {
    this.canvas = React.findDOMNode(this.refs.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousemove', this.getMousePos.bind(this));

    this.arm = new Arm(400, 400);
    var target = new Vec2(400, 200);
    this.mouse = target;

    setTimeout(this.tick.bind(this), 1000/framerate);
  }

  tick() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.arm.target = this.mouse;

    this.ctx.beginPath();
    this.ctx.arc(this.arm.target.x, this.arm.target.y, 2, 0, 2*Math.PI);
    this.ctx.stroke();


    this.arm.tick();
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
