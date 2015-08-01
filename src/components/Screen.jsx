'use strict';

var Component = require('Component');
require('./styles/Screen.scss');

import Square from 'js/Square';
import Bone from 'js/Bone';
import Arm from 'js/Arm';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';

var framerate = 60;


export default class Screen extends Component {


  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static defaultProps = {
    width: 860,
    height: 740
  }

  static stores = [
  ]

  state = this.updatedState();

  updatedState() {
  }


  clear() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
  }


  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return new Vec2(evt.clientX - rect.left, evt.clientY - rect.top);
  }

  componentDidMount() {
    this.canvas = React.findDOMNode(this.refs.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.running = true;

    this.canvas.addEventListener('mousemove', (evt) => {
      this.mouse = this.getMousePos(evt);
    });

    this.canvas.addEventListener("keypress", (evt) => {
      if (e.keyCode == 87) this.running = false;
      else if (e.keyCode == 83) this.running = true;
    });

    this.arm = new Arm(100, 100);
    this.arm.draw(this.ctx);
    var target = new Vec2(180, 180);
    this.mouse = target;
//    this.square = new Square(target.x, 20, 20, "rgb(200, 0, 0)");

    var vec = new Vec2(2, 5, 5);

    var mat = new Mat([
        [3, 0, 2],
        [2, 0, -2],
        [0, 1, 1]
      ]);

   // this.arm.tick();
   // this.arm.draw(this.ctx);


    setTimeout(this.tick.bind(this), 1000/framerate);

  }

  tick() {
    if (this.running) {
      this.arm.target = this.mouse;
      this.clear();
      this.arm.tick();
      this.arm.draw(this.ctx);
    }
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
