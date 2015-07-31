

import Bone from 'js/Bone';
import Vec from 'Vector';

var torqueMultiplier = 0.0001;
export default class Arm {
  constructor(x, y) {
    this.lengths  = [100];//, 75, 50, 50, 45, 30];
    this.freedoms = [ 75];//, 50, 50, 50, 50, 50];
    this.angles   = [  0];//, 50, 20,  5,  5,  5];
    this.origin = new Vec(x, y);

    this.bones = [];

    var {origin, lengths, angles} = this;

    var start = origin;
    var startAngle = 0;
    for (var i = 0; i < lengths.length; i++) {
      var end = new Vec(lengths[i], 0);
      var angle = startAngle + angles[i];
      end = end.rotate(angle).add(start);
      this.bones.push(new Bone(start.x, start.y, end.x, end.y));
      start = end;
      startAngle = angle;
    }

    this.target = this.bones[this.bones.length - 1].p2;

    var Vec1 = new Vec(50, 50);
    var Vec2 = new Vec(24, 29);
  }

  draw(ctx) {
    for (var i = 0; i < this.lengths.length; i++) {
      this.bones[i].draw(ctx);
    }
  }

  tick(ctx) {
    for(var i = this.bones.length - 1; i >= 0; i--) {
      var bone = this.bones[i];
      var R = bone.p2.subtract(bone.p1).rotate(-90).add(bone.p2);
      var F = this.target.subtract(bone.p2).add(bone.p2);
      var tempBone = new Bone(bone.p2.x, bone.p2.y, R.x, R.y);
      //tempBone.draw(ctx);
      tempBone = new Bone(bone.p2.x, bone.p2.y, F.x, F.y);
      //tempBone.draw(ctx);
      var torque =
        bone.p2.subtract(bone.p1).rotate(-90).dot(this.target.subtract(bone.p2));
      torque = (torque > 0 ? Math.sqrt(torque) : -Math.sqrt(-torque)) * torqueMultiplier;
      bone.r_accel = bone.r_accel - torque;
      bone.tick();
    }

    var firstDiff = Math.abs(this.bones[0].getVec().angleDeg()) - this.freedoms[0];
    console.log(firstDiff);
    this.bones[0].clamp(firstDiff);

    for (var i = 0; i < this.bones.length - 1; i++) {
      this.bones[i + 1].moveTo(this.bones[i].p2);
      var angle = this.bones[i].getVec().angleTo(this.bones[i + 1].getVec());
      var diff = Math.abs(angle) - freedoms[i] * Math.PI / 180;
      if (diff > 0)
        this.bones[i + 1].rotate(diff);
      
    }
  }

  setTarget(x, y) {
    this.target = new Vec(x, y);
  }



}
