

import Bone from 'js/Bone';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';

var torqueMultiplier = 0.0001;


function clampAngle(rads) {
  while (rads < 0)
    rads += 2*Math.PI;
  while (rads > 2 * Math.PI)
    rads -= 2*Math.PI;
  return rads;
}

function clampMag(vec, max) {
  return vec.lengthSq() > max*max ? vec.resize(max) : vec;
}

export default class Arm {

  constructor(x, y) {
    this.lengths  = [400, 375, 250, 150];//, 75, 50, 50, 75, 50, 50, 75, 50, 50];
    this.freedoms = [ 75, 50, 50, 50];//, 50, 50, 50, 50, 50, 50, 50, 50, 50];
    this.angles   = [-45,  0,  0,  0];//,  0,  0,  0,  0,  0,  0,  0,  0,  0];

    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i] = this.angles[i] * Math.PI / 180;
      console.log(this.angles[i]);
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

  newJacobian(target = this.target) {
    var bones = this.genBones();
    var s = bones.map((bone) => {return bone.p2;} );
    console.log(s);
  }

  computeJacobian(t = this.target) {
    var bones = this.genBones();
    var s = bones[bones.length - 1].p2;
    var e = clampMag(t.subtract(s), 50);
    var threshold = 9;
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
    J = new Mat(J);
    var jInv;



   ///// var lambda = 1;
    //jInv = J.transpose().multiply(J.multiply(J.transpose()).addIdentity(lambda * lambda).inverse()).multiply(e);
//    jInv = J.transpose().multiply(J).inverse().multiply(J.transpose());
    jInv = J.transpose();
    var matE = new Mat([e.arr()]).transpose();
    var scale = 0.000001;
    var result = jInv.scale(scale).multiply(matE);
    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i] = this.angles[i] + result.values[i][0];
//      if (this.angles[i] < -this.freedoms[i]) this.angles[i] = -this.freedoms[i];
 //     if (this.angles[i] > this.freedoms[i]) this.angles[i] = this.freedoms[i];
    }
  }

  tick() {
    this.computeJacobian();
  }

  setTarget(x, y) {
    this.target = new Vec2(x, y);
  }


}
