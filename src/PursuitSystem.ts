import { EntityIteratingSystem } from "flat-ecs";
import { PathFinding } from "./component/PathFinding";
import { Pursuit } from "./component/Pursuit";
import { Spartial } from "./component/Spartial";

export default class PursuitSystem extends EntityIteratingSystem {
  constructor() {
    super([Pursuit, PathFinding]);
  }
  processEntity(entityId: number): void {
    const pursuit = this.world.getComponent(entityId, Pursuit);
    const pathfinding = this.world.getComponent(entityId, PathFinding);

    if (pursuit.cooldownLeft > 0) {
      pursuit.cooldownLeft -= this.world.delta;
      return;
    }

    const targetPos = this.world.getComponent(pursuit.target, Spartial).pos;
    pathfinding.setTarget(targetPos.x, targetPos.y);
    pursuit.cooldownLeft = pursuit.cooldownRequired;
  }
}
