import { World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Moveable } from "../component/Movable";
import { PathFinding } from "../component/PathFinding";
import { Spartial } from "../component/Spartial";
import { GameState } from "../dto/gameState";
import { LayerMapRender } from "../ulis/layerMapRender";

export class EnemyProcessingSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("layersMapRender") layersMapRender: LayerMapRender;

  spartialPlayer = new Vector2();
  direction = new Vector2();
  tempVec2 = new Vector2();
  dcm = false;
  spartialEnemy = new Vector2();

  process(): void {
    this.spartialPlayer.set(
      this.bumpWorld.getRect("player").x +
        this.bumpWorld.getRect("player").w / 2,
      this.bumpWorld.getRect("player").y +
        this.bumpWorld.getRect("player").h / 2
    );

    for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Spartial
      );
      const moveableEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Moveable
      );
      const pathFinding = this.world.getComponent(
        this.gameState.enemyIDs[i],
        PathFinding
      );

      this.direction
        .setVector(moveableEnemy.direction)
        .subVector(spartialEnemy.pos)
        .nor();

      spartialEnemy.pos.add(
        this.direction.x * moveableEnemy.speed,
        this.direction.y * moveableEnemy.speed
      );
      // let enemyRect = this.bumpWorld.getRect(`enemy${i}`);
      // this.bumpWorld.move(
      //   `enemy${i}`,
      //   enemyRect.x + this.direction.x * moveableEnemy.speed,
      //   enemyRect.y + this.direction.y * moveableEnemy.speed
      // );
      // spartialEnemy.pos.set(
      //   this.bumpWorld.getRect(`enemy${i}`).x,
      //   this.bumpWorld.getRect(`enemy${i}`).y
      // );
    }
    // const pathFinding = this.world.getComponent(
    //   this.gameState.enemyIDs[0],
    //   PathFinding
    // );
    // if ((this.dcm = false)) {
    // }
  }
}
