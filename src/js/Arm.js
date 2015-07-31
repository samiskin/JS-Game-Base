

import Bone from 'js/Bone';
import Vec2 from 'Vec2';
import Mat from 'Mat';

var torqueMultiplier = 0.0001;


export default class Arm {

  constructor(x, y) {
    this.lengths  = [100, 75];//, 50, 50, 45, 30];
    this.freedoms = [ 75, 50];//, 50, 50, 50, 50];
    this.angles   = [  0, 50];//, 20,  5,  5,  5];
    this.origin = new Vec2(x, y);

    this.bones = [];
    this.bones.push(new Bone(this.origin.x, this.origin.y, this.origin.x +
          this.lengths[0], this.origin.y));

    for (var i = 1; i < this.lengths.length; i++) {
      var start = this.bones[i - 1].p2;
      var vec = new Vec2(this.lengths[i], 0);
        vec = vec.rotate(this.angles[i]).add(start);
      this.bones.push(new Bone(start.x, start.y, vec.x, vec.y));
    }

    var {origin, lengths, angles} = this;

  }

  draw(ctx) {
    for (var i = 0; i < this.bones.length; i++) {
      this.bones[i].draw(ctx);
    }
  }

  computeJacobian(target) {
    var {bones, origin} = this;

    var J = [[], [], []];
    target = target.subtract(origin);
    var p = origin;
    var e = bones[bones.length - 1].p2;
    for (var bone = 0; bone < bones.length; bone++) {
      var ji = Vec3(0, 0, 1).cross(e.subtract(p));
      J[0].push(ji.x);
      J[1].push(ji.y);
      J[2].push(ji.z);
      p = bones[bone].p2;
    }
    
  }

  tick(ctx) {

  }

  setTarget(x, y) {
    this.target = new Vec2(x, y);
  }


}
