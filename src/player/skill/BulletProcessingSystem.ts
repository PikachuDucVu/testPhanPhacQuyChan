import { World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spartial";
import { GameState } from "../../dto/gameState";
import { LayerMapRender } from "../../ulis/layerMapRender";

export class BulletProcessingSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("layersMapRender") layersMapRender: LayerMapRender;
  @Inject("obstacles") obstacles: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];

  tempVec2Obstacle = new Vector2();

  process(): void {
    for (let i = this.gameState.bulletIDs.length - 1; i >= 0; i--) {
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Damage
      );
      spartialBullet.pos.add(
        moveAbleBullet.direction.x * moveAbleBullet.speed,
        moveAbleBullet.direction.y * moveAbleBullet.speed
      );

      //checkCollisionWithObstacle
      for (let j = 0; j < this.layersMapRender.obstacle.length; j++) {
        if (this.layersMapRender.obstacle[j]) {
          this.tempVec2Obstacle.set(
            this.bumpWorld.getRect(`obstacle${j}`).x +
              this.bumpWorld.getRect(`obstacle${j}`).w / 2,
            this.bumpWorld.getRect(`obstacle${j}`).y +
              this.bumpWorld.getRect(`obstacle${j}`).h / 2
          );
          if (
            spartialBullet.pos.distance(this.tempVec2Obstacle) <
            this.bumpWorld.getRect(`obstacle${j}`).w / 2
          ) {
            this.world.deleteEntity(this.gameState.bulletIDs[i]);
            this.gameState.bulletIDs.splice(i, 1);
          }
        }
      }
      for (let j = this.gameState.enemyIDs.length - 1; j >= 0; j--) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Spartial
        );

        if (spartialEnemy.pos.distance(spartialBullet.pos) < 5) {
          this.world.deleteEntity(this.gameState.enemyIDs[j]);
          this.gameState.enemyIDs.splice(j, 1);
        }
      }
    }
  }
}
