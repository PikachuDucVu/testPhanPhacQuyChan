import { EntityIteratingSystem, Inject } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import Walkable from "walkable";
import { Moveable } from "./component/Movable";
import { PathFinding } from "./component/PathFinding";
import { Spartial } from "./component/Spartial";

export default class PathFindingSystem extends EntityIteratingSystem {
  @Inject("walkable")
  walkable: Walkable;
  constructor() {
    super([PathFinding, Moveable, Spartial]);
  }

  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  processEntity(entityId: number): void {
    const { world, walkable } = this;
    const pathFinding = world.getComponent(entityId, PathFinding);
    const movable = world.getComponent(entityId, Moveable);
    const spartial = world.getComponent(entityId, Spartial);

    if (pathFinding.active) {
      if (pathFinding.path.length === 0) {
        try {
          walkable.findPath(
            spartial.pos.x,
            spartial.pos.y,
            pathFinding.target.x,
            pathFinding.target.y,
            spartial.radius / 2,
            pathFinding.path
          );
        } catch (e) {
          console.log("pathfinding issue");
        }
      }
      this.shapeRenderer.begin();
      for (let i = 0; i < pathFinding.path.length / 2 - 1; i++) {
        this.shapeRenderer.circle(
          true,
          pathFinding.path[i * 2],
          pathFinding.path[i * 2 + 1],
          spartial.radius,
          Color.RED
        );
      }
      this.shapeRenderer.end();

      if (pathFinding.path.length > 0) {
        if (pathFinding.index < pathFinding.path.length / 2 - 1) {
          pathFinding.index++;
          movable.setDirection(
            pathFinding.path[pathFinding.index * 2],
            pathFinding.path[pathFinding.index * 2 + 1]
          );
        } else {
          pathFinding.index = -1;
          pathFinding.path.length = 0;
        }
      }
    }
  }
}
