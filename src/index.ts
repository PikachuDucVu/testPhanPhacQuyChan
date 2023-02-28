import {
  Color,
  createGameLoop,
  createStage,
  createViewport,
  OrthoCamera,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  ViewportInputHandler,
} from "gdxts";
import { Vector2 } from "gdxts/dist/lib/Vector2";
import { Constants } from "./Constant";

interface JoyStick {
  origin: Vector2;
  thumbPos: Vector2;
  direction: Vector2;

  touched: boolean;
  move: boolean;
  dragging: boolean;
}

function moveMainCharacter(
  inputHandler: ViewportInputHandler,
  joyStick: JoyStick,
  posMainCharacter: Vector2,
  camera: OrthoCamera
) {
  if (inputHandler.isTouched()) {
    joyStick.origin.set(camera.position.x, camera.position.y);
    joyStick.thumbPos.setVector(inputHandler.getTouchedWorldCoord());
    joyStick.direction
      .setVector(joyStick.thumbPos)
      .subVector(joyStick.origin)
      .nor();

    if (
      posMainCharacter.x > 0 &&
      posMainCharacter.x < 10000 &&
      posMainCharacter.y > -8000 &&
      posMainCharacter.y < 2000
    ) {
      posMainCharacter.addVector(joyStick.direction.scale(20));
    } else if (posMainCharacter.x < 0) {
      posMainCharacter.x = 1;
    } else if (posMainCharacter.y > 2000) {
      posMainCharacter.y = 1999;
    } else if (posMainCharacter.x > 10000) {
      posMainCharacter.x = 9999;
    } else if (posMainCharacter.y < -8000) {
      posMainCharacter.y = -7999;
    }
  }
}

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(
    canvas,
    Constants.SCREEN_WIDTH,
    Constants.SCREEN_HEIGHT
  );
  const gl = viewport.getContext();

  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  const camera = viewport.getCamera();
  const mapData = await fetch("./map.tmj").then((res) => res.json());

  const posMainCharacter = new Vector2(1000, 1000);
  const posMap = mapData.layers.find((w: any) => w.name === "map").objects;
  const mapImage: Texture[] = [];
  const renderImage = new Map<number, Texture>();

  for (let i = 0; i < posMap.length; i++) {
    renderImage.set(i, await Texture.load(gl, `./fmg_tile_${i}.png`));
  }
  gl.clearColor(0, 0, 0, 1);

  const inputHandler = new ViewportInputHandler(viewport);

  const tempTouchedWorldCoord = new Vector2();
  const tempDirection = new Vector2();

  const joyStick: JoyStick = {
    origin: new Vector2(),
    direction: new Vector2(),
    thumbPos: new Vector2(),

    touched: false,
    move: false,
    dragging: false,
  };

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.combined);
    shapeRenderer.setProjection(camera.combined);
    camera.setPosition(posMainCharacter.x, posMainCharacter.y);
    camera.update();

    moveMainCharacter(inputHandler, joyStick, posMainCharacter, camera);

    batch.begin();

    for (let i = renderImage.size - 1; i >= 0; i--) {
      if (
        Math.abs(posMainCharacter.x - (posMap[i].x + posMap[i].width / 2)) <=
          1250 &&
        Math.abs(posMainCharacter.y - (-posMap[i].y + posMap[i].height / 2)) <=
          1250
      ) {
        const texture = renderImage.get(i);
        if (!texture) continue;
        batch.draw(
          texture,
          posMap[i].x,
          -posMap[i].y,
          posMap[i].width,
          posMap[i].height
        );
      }
    }
    batch.end();

    shapeRenderer.begin();
    for (let i = 0; i < renderImage.size; i++) {
      shapeRenderer.circle(
        true,
        posMap[i].x + 1000,
        -posMap[i].y + 1000,
        75,
        Color.BLUE
      );
    }

    shapeRenderer.circle(
      true,
      joyStick.thumbPos.x,
      joyStick.thumbPos.y,
      35,
      Color.WHITE
    );

    shapeRenderer.circle(
      true,
      posMainCharacter.x,
      posMainCharacter.y,
      25,
      Color.RED
    );
    shapeRenderer.end();
  });
};
init();
