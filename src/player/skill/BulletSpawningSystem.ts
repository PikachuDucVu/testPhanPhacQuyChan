import { World } from "bump-ts";
import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spartial";
import { GameState } from "../../dto/gameState";

export class BulletSpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("bumpWorld") bumpWorld: World;

  attackSpeed = 1;
  time = 0;
  tempDistance = 0;
  spartialPlayer = new Vector2();

  tempVec2 = new Vector2();
  offsetW = 0;
  offsetH = 0;

  initialized(): void {
    this.offsetW = this.bumpWorld.getRect("player").w;
    this.offsetH = this.bumpWorld.getRect("player").h;
  }

  process(): void {
    this.time += this.world.delta;

    this.spartialPlayer.set(
      this.bumpWorld.getRect("player").x +
        this.bumpWorld.getRect("player").w / 2,
      this.bumpWorld.getRect("player").y +
        this.bumpWorld.getRect("player").h / 2
    );

    if (this.time >= this.attackSpeed) {
      const bulletArchetype = new Archetype([Spartial, Moveable, Damage]);
      const bullet = this.world.createEntityByArchetype(bulletArchetype);
      this.gameState.bulletIDs.push(bullet);
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Damage
      );
      damageBullet.setDmg(5);

      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[0],
        Spartial
      );
      this.tempDistance = spartialEnemy.pos.distance(this.spartialPlayer);
      this.tempVec2
        .setVector(spartialEnemy.pos)
        .subVector(this.spartialPlayer)
        .nor();
      for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[i],
          Spartial
        );
        if (
          this.tempDistance >= spartialEnemy.pos.distance(this.spartialPlayer)
        ) {
          this.tempDistance = spartialEnemy.pos.distance(this.spartialPlayer);
          this.tempVec2
            .setVector(spartialEnemy.pos)
            .subVector(this.spartialPlayer)
            .nor();
        }
      }
      spartialBullet.setPos(this.spartialPlayer.x, this.spartialPlayer.y);
      spartialBullet.setRadius(3);

      moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAbleBullet.speed = 5;
      this.time = 0;
    }
  }
}
