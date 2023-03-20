import { Component } from "flat-ecs";
import { Vector2 } from "gdxts";

export class PathFinding extends Component {
  target: Vector2 = new Vector2();
  path: number[] = [];
  index: number = -1;
  active: boolean = false;
  setActive(active: boolean) {
    this.active = active;
  }
  setTarget(x: number, y: number) {
    this.target.set(x, y);

    this.active = true;
    this.index = -1;
    this.path.length = 0;
  }
}
