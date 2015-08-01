

import Bone from 'js/Bone';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';



function clampAngle(rads) {
  while (rads < 0)
    rads += 2*Math.PI;
  while (rads > 2 * Math.PI)
    rads -= 2*Math.PI;
  return rads;
}

function getAngleDif(a1, a2) {
  var ang = clampAngle(a1) - clampAngle(a2);
  if (ang > Math.PI) ang -= 2*Math.PI;
  if (ang < -Math.PI) ang += 2*Math.PI;
  return ang;
}

function clampMag(vec, max) {
  return vec.lengthSq() > max*max ? vec.resize(max) : vec;
}

function clampVal(val, max, min) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

export default class Arm {

  constructor(x, y) {
    this.lengths  = [100, 75, 50, 50];
    this.angles   = [-45,  0,  0,  0];

    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i] = this.angles[i] * Math.PI / 180;
    }
    this.origin = new Vec2(x, y);
  }

  draw(ctx) {
    var bones = this.genBones();
    for (var i = 0; i < bones.length; i++) {
      bones[i].draw(ctx);
    }
  }

  genBones() {
    var bones = [];
    var bone1 = new Vec2(this.lengths[0], 0);
    bone1 = bone1.rotate(this.angles[0]).add(this.origin);
    bones.push (new Bone(this.origin.x, this.origin.y, bone1.x, bone1.y));

    for (var i = 1; i < this.lengths.length; i++) {
      var start = bones[i - 1].p2;
      var vec = new Vec2(this.lengths[i], 0);
        vec = vec.rotate(this.angles[i]).add(start);
      bones.push(new Bone(start.x, start.y, vec.x, vec.y));
    }
    return bones;
  }


  tick() {
    var t = this.target;
    var bones = this.genBones();
    var s = bones[bones.length - 1].p2;
    var e = clampMag(t.subtract(s), 150);
    var threshold = 25;
    if (e.lengthSq() < threshold) return;

    var J = [[], [], []];
    var p = this.origin;
    var v = new Vec3(0, 0, 1);
    for (var bone = 0; bone < bones.length; bone++) {
      var ji = v.cross(s.subtract(p));
      J[0].push(ji.x);
      J[1].push(ji.y);
      J[2].push(ji.z);
      p = bones[bone].p2;
    }

    var jInv = (new Mat(J)).transpose();
    var matE = new Mat([e.arr()]).transpose();
    var scale = 0.00001;
    var result = jInv.scale(scale).multiply(matE);
    for (var i = 0; i < this.angles.length; i++)
      this.angles[i] = clampAngle(this.angles[i] + result.values[i][0]);
  }


  setTarget(x, y) {
    this.target = new Vec2(x, y);
  }


}
