import { Inject, System } from "flat-ecs";
import { ShapeRenderer } from "gdxts";
import { Spartial } from "../../component/Spartial";
import { GameState } from "../../dto/gameState";

export class BulletRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.bulletIDs.length; i++) {
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Spartial
      );
      this.shapeRenderer.circle(
        true,
        spartialBullet.pos.x,
        spartialBullet.pos.y,
        spartialBullet.radius
      );
    }
    this.shapeRenderer.end();
  }
}
