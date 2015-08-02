

import Bone from 'js/Bone';
import Vec2 from 'Vec2';
import Vec3 from 'Vec3';
import Mat from 'Mat';



function clampAngle(rads) {
  rads = rads % (2 * Math.PI);
  if (rads < -Math.PI)
    rads += 2*Math.PI;
  else if (rads > Math.PI)
    rads -= 2*Math.PI;
  return rads;
}

function toRads(degs) {
  return degs * Math.PI / 180;
}

function toDegs(rads) {
  return rads * 180 / Math.PI;
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
  return Math.max(min, Math.min(max, val));
}

function toDegArray(radArray) {
  var ret = [];
  for (var i = 0; i < radArray.length; i++)
    ret.push(toDegs(radArray[i]));
  return ret;
}

export default class Arm {

  constructor(x, y) {
    this.lengths  = [100, 75, 50, 50];
    this.angles   = [-45,  0,  0,  0];

    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i] = toRads(this.angles[i]);
    }
    this.origin = new Vec2(x, y);
  }

  draw(ctx) {
    var bones = this.genBones();
    for (var i = 0; i < bones.length; i++) {
      bones[i].draw(ctx);
    }
  }

  genBones(angles = this.angles) {
    var bones = [];
    var bone1 = new Vec2(this.lengths[0], 0);
    bone1 = bone1.rotate(angles[0]).add(this.origin);
    bones.push (new Bone(this.origin.x, this.origin.y, bone1.x, bone1.y));

    for (var i = 1; i < angles.length; i++) {
      var start = bones[i - 1].p2;
      var angle = 0;

      for (var ang = i; ang >= 0; ang--){
        angle += angles[ang];
      }

      var vec = new Vec2(this.lengths[i], 0);
      vec = vec.rotate(angle).add(start);
      bones.push(new Bone(start.x, start.y, vec.x, vec.y));
    }
    return bones;
  }


  jacobianTranspose() {
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

  goToOrientation(targetAngles = this.angles) {
    for (var bone = 0; bone < this.lengths.length; bone++) {
      var curr = toDegs(this.angles[bone]);
      var dt = ((((toDegs(targetAngles[bone]) - curr) % 360) + 540) % 360) - 180;
      if (Math.abs(dt) >= 1)
        this.angles[bone] += clampAngle(toRads(dt)) * 0.1;
    }
  }

  CCD() {
    var target = this.target;
    var epsilon = 0.0001;
    var trivialArcLength = 0.00001;
    var arrivalDistSq = 1;

    var bones = this.genBones();
    var end = bones[bones.length - 1].p2;
    var bonesChanged = false;
    var angles = this.angles.slice(0);
    for (var boneId = bones.length - 1; boneId >= 0; boneId--) {
      var curToEnd = end.subtract(bones[boneId].p1);
      var curToTarget = target.subtract(bones[boneId].p1);

      var cosRotAng = 1;
      var sinRotAng = 0;
      var endTargetMag = curToEnd.length() * curToTarget.length();
      if (endTargetMag > epsilon) {
        cosRotAng = curToEnd.dot(curToTarget) / endTargetMag;
        sinRotAng = (curToEnd.x * curToTarget.y - curToEnd.y * curToTarget.x) / endTargetMag;
      }

      var rotAng = Math.acos(clampVal(cosRotAng, 1, -1));
      if (sinRotAng < 0) rotAng = -rotAng;
      end.x = bones[boneId].p1.x + cosRotAng*curToEnd.x - sinRotAng*curToEnd.y;
      end.y = bones[boneId].p1.y + sinRotAng*curToEnd.x + cosRotAng*curToEnd.y;
      angles[boneId] += rotAng;
    }

    return angles;
  }

  tick() {
    //this.jacobianTranspose();
    this.goToOrientation(this.CCD());
  }


  setTarget(x, y) {
    this.target = new Vec2(x, y);
  }


}
