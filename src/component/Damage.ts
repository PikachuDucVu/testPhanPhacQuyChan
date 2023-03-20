import { Component } from "flat-ecs";

export class Damage extends Component {
  private damage: number;

  setDmg(dmg: number) {
    this.damage = dmg;
  }
}
