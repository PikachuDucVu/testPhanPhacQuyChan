import { World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Spartial } from "../component/Spartial";
import { GameState } from "../dto/gameState";
import { Port } from "../ulis/port";

export class PlayerRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("currentMapData") currentMapData: any;
  @Inject("port") port: Port;
  @Inject("gameState") gameState: GameState;

  process(): void {
    let playerRect = this.bumpWorld.getRect("player");

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    this.shapeRenderer.begin();

    this.shapeRenderer.rect(
      true,
      spartialPlayer.pos.x,
      spartialPlayer.pos.y,
      playerRect.w,
      playerRect.h,
      Color.GREEN
    );

    this.shapeRenderer.end();
  }
}
