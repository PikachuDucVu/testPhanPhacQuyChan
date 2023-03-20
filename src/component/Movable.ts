import { Component } from "flat-ecs";
import { Vector2 } from "gdxts";

export class Moveable extends Component {
  direction: Vector2 = new Vector2(0, 0);
  speed: number;
  active: boolean = false;

  setDirection(x: number, y: number) {
    this.direction.set(x, y);
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  setActive(active: boolean) {
    this.active = active;
  }
}
