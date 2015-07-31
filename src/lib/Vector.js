

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


export default class Vec {

  constructor(x, y) {
    this.x = x; this.y = y;
  }

  clone() {
    return new Vec(this.x, this.y);
  }


  length() {
    return Math.sqrt(this.lengthSq());
  }

  lengthSq() {
    return this.x*this.x + this.y*this.y;
  }

  add(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }


  subtract(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  multiply(scale) {
    return new Vec(this.x * scale, this.y * scale);
  }

  normalize() {
    return this.multiply(1/this.length());
  }

  resize(size) {
    return this.multiply(size / this.length());
  }

  rotate(angle) {
    var {x, y} = this;
    angle = toRadians(angle);
    var retX = x * cos(angle) - y * sin(angle);
    var retY = y * cos(angle) + x * sin(angle);
    return new Vec(retX, retY);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
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


}


