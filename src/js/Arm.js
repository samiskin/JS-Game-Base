

import Bone from 'js/Bone';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';

var torqueMultiplier = 0.0001;


export default class Arm {

  constructor(x, y) {
    this.lengths  = [100, 75, 50, 50, 45, 30];
    this.freedoms = [ 75, 50, 50, 50, 50, 50];
    this.angles   = [ 20, 50, 20,  5,  5,  5];
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

  computeJacobian(target = this.target) {
    var bones = this.genBones();
    var e = bones[bones.length - 1].p2;
    var threshold = 3;
    if (target.subtract(e).length() < threshold) return;

    var J = [[], [], []];//, [], [], []];
    //target = target.subtract(this.origin);
    var p = this.origin;
    var a = new Vec3(0, 0, 1);
    for (var bone = 0; bone < bones.length; bone++) {
      var ji = a.cross(e.subtract(p));
      J[0].push(ji.x);
      J[1].push(ji.y);
      J[2].push(ji.z);
      p = bones[bone].p2;
    }
    J = new Mat(J);
    var jInv;
    //jInv = J.transpose().multiply(J.multiply(J.transpose()).inverse());
    jInv = J.transpose();
    var scale = 0.001;
    var dx = new Mat([target.subtract(e).scale(scale).arr()]).transpose();
    var result = jInv.multiply(dx);
    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i] = this.angles[i] + result.values[i][0];
    }
    
  }

  tick() {
    this.computeJacobian();
  }

  setTarget(x, y) {
    this.target = new Vec2(x, y);
  }


}
