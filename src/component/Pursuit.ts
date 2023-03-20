import { Component } from "flat-ecs";

export class Pursuit extends Component {
  target: number = -1;
  cooldownRequired: number = 0;
  cooldownLeft: number = 0;
}
