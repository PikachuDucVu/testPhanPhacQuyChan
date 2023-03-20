import { IRect, World } from "bump-ts";
import { Archetype, Inject, System } from "flat-ecs";
import { ViewportInputHandler, Vector2 } from "gdxts";
import { Damage } from "../component/Damage";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spartial";
import { GameState } from "../dto/gameState";
export interface JoyStick {
  origin: Vector2;
  thumbPos: Vector2;
  direction: Vector2;

  touched: boolean;
  move: boolean;
  dragging: boolean;
}

function movePlayer(
  inputHandler: ViewportInputHandler,
  joyStick: JoyStick,
  playerRect: IRect
) {
  if (inputHandler.isTouched()) {
    joyStick.origin.set(playerRect.x, playerRect.y);
    joyStick.thumbPos.setVector(inputHandler.getTouchedWorldCoord());
    joyStick.direction
      .setVector(joyStick.thumbPos)
      .subVector(joyStick.origin)
      .nor();
  } else {
    joyStick.direction.set(0, 0);
  }
  return joyStick.direction;
}

export class PlayerMovementSystem extends System {
  @Inject("inputHandler") inputHandler: ViewportInputHandler;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("gameState") gameState: GameState;

  initialized(): void {
    const playerArchetype = new Archetype([Spartial, Health, Damage]);
    const player = this.world.createEntityByArchetype(playerArchetype);
    this.gameState.playerID = player;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    spartialPlayer.setPos(
      this.bumpWorld.getRect("player").x,
      this.bumpWorld.getRect("player").y
    );

    // const moveablePlayer = this.world.getComponent(
    //   this.gameState.playerID,
    //   Moveable
    // );
    // moveablePlayer.setSpeed(5);
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );
    console.log(this.gameState.playerID);
    healthPlayer.setHp(100);
    healthPlayer.setMaxHP(100);
    const damagePlayer = this.world.getComponent(
      this.gameState.playerID,
      Damage
    );
    damagePlayer.setDmg(3);
  }

  process(): void {
    let playerRect = this.bumpWorld.getRect("player");
    const tempVec2 = movePlayer(this.inputHandler, this.joyStick, playerRect);

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    this.bumpWorld.move(
      "player",
      playerRect.x + tempVec2.x,
      playerRect.y + tempVec2.y
    );

    spartialPlayer.setPos(
      this.bumpWorld.getRect("player").x,
      this.bumpWorld.getRect("player").y
    );
  }
}
