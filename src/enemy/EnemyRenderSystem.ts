import { World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spartial";
import { GameState } from "../dto/gameState";

export class EnemyRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;
  @Inject("bumpWorld") bumpWorld: World;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Spartial
      );
      const healthEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Health
      );

      this.shapeRenderer.circle(
        true,
        spartialEnemy.pos.x,
        spartialEnemy.pos.y,
        spartialEnemy.radius
      );
    }
    this.shapeRenderer.end();
  }
}
