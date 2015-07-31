
import Vec from 'Vec2';
export default class Square {

  constructor(x, y, size, color) {
    this.size = size;
    this.color = color;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    var {x, y, size, color} = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);;
    ctx.restore();
  }


}
