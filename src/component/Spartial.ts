import { Component } from "flat-ecs";
import { Vector2 } from "gdxts";

export class Spartial extends Component {
  pos: Vector2 = new Vector2(0, 0);
  radius: number = 0;

  setPos(x: number, y: number) {
    this.pos.set(x, y);
  }
  setRadius(r: number) {
    this.radius = r;
  }
  setRotation(r: number) {
    this.pos.rotate(r);
  }
}
