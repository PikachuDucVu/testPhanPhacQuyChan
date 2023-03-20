import { Component } from "flat-ecs";

export class Health extends Component {
  private hp: number;
  private maxHP: number;

  setHp(hp: number) {
    this.hp = hp;
  }
  setMaxHP(maxHP: number) {
    this.maxHP = maxHP;
  }
}
