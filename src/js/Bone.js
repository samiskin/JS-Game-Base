

import Vec from 'Vec2'

export default class Bone {

  constructor(x1, y1, x2, y2) {
    this.p1 = new Vec(x1, y1);
    this.p2 = new Vec(x2, y2);
    this.r_accel = 0; // in radians
    this.r_vel = 0;
  }

  tick() {
    this.r_vel += this.r_accel;
    this.rotate(this.r_vel);
  }

  rotate(angle) {
    this.p2 = this.p2.subtract(this.p1).rotate(angle).add(this.p1);
  }

  angle() {
    return this.p2.subtract(this.p1).angle();
  }

  moveTo(root) {
    var diff = this.p2.subtract(this.p1);
    this.p1 = root.clone();
    this.p2 = this.p1.add(diff);
  }

  getVec() {
    return this.p2.subtract(this.p1);
  }

  clamp(overshoot) {
    if (overshoot > 0) {
      this.rotate(-overshoot);
      this.r_vel = 0;
    }
  }

  draw(ctx) {
    var {p1, p2} = this;
    var path = new Path2D();
    var diff = p2.subtract(p1);
    var r1 = diff.length() / 5;
    var r2 = r1 / 2;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, r1, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p2.x, p2.y, r2, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();


    var ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    var start1 = new Vec(p1.x + Math.cos(ang + Math.PI / 2) * r1, p1.y +
        Math.sin(ang + Math.PI/2) * r1);
    var end1 = new Vec(p2.x + Math.cos(ang + Math.PI / 2) * r2, p2.y +
        Math.sin(ang + Math.PI/2) * r2);

    var start2 = new Vec(p1.x + Math.cos(ang - Math.PI / 2) * r1, p1.y +
        Math.sin(ang - Math.PI/2) * r1);
    var end2 = new Vec(p2.x + Math.cos(ang - Math.PI / 2) * r2, p2.y +
        Math.sin(ang - Math.PI/2) * r2);

    ctx.beginPath();
    ctx.moveTo(start1.x, start1.y);
    ctx.lineTo(end1.x, end1.y);
    ctx.moveTo(start2.x, start2.y);
    ctx.lineTo(end2.x, end2.y);
    ctx.stroke();



  }


}
