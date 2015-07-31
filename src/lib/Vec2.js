
import Vec3 from 'Vec3';

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function sin(angle) {
  return Math.sin(angle);
}

function cos(angle) {
  return Math.cos(angle);
}


export default class Vec2 extends Vec3 {

  constructor(x, y) {
    super(x, y, 0);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  angleDeg() {
    return toDegrees(this.angle());
  }

  angleTo(other) {
    return this.dot(other)/(this.length() * other.length());
  }

  rotate(angle) {
    var {x, y} = this;
    angle = toRadians(angle);
    var retX = x * cos(angle) - y * sin(angle);
    var retY = y * cos(angle) + x * sin(angle);
    return new Vec2(retX, retY);
  }


}


