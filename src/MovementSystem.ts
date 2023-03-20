import { EntityIteratingSystem, InjectMapper, ComponentMapper } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Moveable } from "./component/Movable";
import { Spartial } from "./component/Spartial";

export default class MovementSystem extends EntityIteratingSystem {
  @InjectMapper(Moveable)
  movableMapper: ComponentMapper<Moveable>;
  @InjectMapper(Spartial)
  spartialMapper: ComponentMapper<Spartial>;
  constructor() {
    super([Spartial, Moveable]);
  }
  tmp: Vector2 = new Vector2(0, 0);
  processEntity(entityId: number): void {
    const { movableMapper, spartialMapper, tmp } = this;
    const movable = movableMapper.get(entityId);
    const spartial = spartialMapper.get(entityId);
    const delta = this.world.delta;
    const { pos } = spartial;

    const { direction, speed } = movable;

    tmp.setVector(direction).subVector(pos);
    // console.log(direction, pos, entityId);

    if (tmp.len() >= speed * delta) {
      tmp.nor().scale(speed);
    } else {
      tmp.scale(delta);
      movable.setActive(false);
    }
  }
}
