import { World } from "bump-ts";
import { System, Inject, Archetype } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { PathFinding } from "../component/PathFinding";
import { Pursuit } from "../component/Pursuit";
import { Spartial } from "../component/Spartial";
import { Constants } from "../Constant";
import { GameState } from "../dto/gameState";
import { LayerMapRender } from "../ulis/layerMapRender";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class EnemySpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("layersMapRender") layersMapRender: LayerMapRender;

  MAX_ENEMIES = 2;
  remainingTimeSpawnEnemy = 0;
  posSpawnEnemy = new Vector2();
  tempVec2 = new Vector2();
  tempboolean = false;
  spartialPlayer = new Vector2();

  process(): void {
    this.remainingTimeSpawnEnemy += this.world.delta;

    this.spartialPlayer.set(
      this.bumpWorld.getRect("player").x +
        this.bumpWorld.getRect("player").w / 2,
      this.bumpWorld.getRect("player").y +
        this.bumpWorld.getRect("player").h / 2
    );
    if (
      this.remainingTimeSpawnEnemy > 1 &&
      this.gameState.enemyIDs.length < this.MAX_ENEMIES
    ) {
      const enemyArchetype = new Archetype([
        Spartial,
        Health,
        Moveable,
        PathFinding,
        Pursuit,
      ]);
      const enemy = this.world.createEntityByArchetype(enemyArchetype);

      do {
        this.posSpawnEnemy.set(
          getRandomInt(0, Constants.MAP_WIDTH),
          getRandomInt(20, Constants.MAP_HEIGHT)
        );

        this.tempboolean = false;
        for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
          if (this.layersMapRender.obstacle[i]) {
            this.tempVec2.set(
              this.bumpWorld.getRect(`obstacle${i}`).x +
                this.bumpWorld.getRect(`obstacle${i}`).w / 2,
              this.bumpWorld.getRect(`obstacle${i}`).y +
                this.bumpWorld.getRect(`obstacle${i}`).h / 2
            );
          }
          if (this.posSpawnEnemy.distance(this.tempVec2) < 15) {
            this.tempboolean = true;
          }
        }
      } while (this.tempboolean);

      this.gameState.enemyIDs.push(enemy);
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Spartial
      );
      spartialEnemy.pos.setVector(this.posSpawnEnemy);
      spartialEnemy.setRadius(5);
      // this.bumpWorld.add(
      //   `enemy${this.gameState.enemyIDs.length - 1}`,
      //   spartialEnemy.pos.x,
      //   spartialEnemy.pos.y,
      //   spartialEnemy.radius,
      //   spartialEnemy.radius
      // );
      const moveableEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Moveable
      );
      moveableEnemy.setSpeed(0.5);
      const pursuit = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Pursuit
      );
      pursuit.target = this.gameState.playerID as number;
      pursuit.cooldownRequired = 0.25;

      const healthEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Health
      );
      healthEnemy.setHp(100);
      healthEnemy.setMaxHP(100);

      const pathFinding = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        PathFinding
      );
      pathFinding.setTarget(this.spartialPlayer.x, this.spartialPlayer.y);

      this.remainingTimeSpawnEnemy = 0;
    }
  }
}
