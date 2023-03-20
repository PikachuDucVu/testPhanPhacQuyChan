import Bump from "bump-ts";
import { Archetype, World } from "flat-ecs";
import {
  createGameLoop,
  createStage,
  createViewport,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  TextureRegion,
  ViewportInputHandler,
} from "gdxts";
import { Vector2 } from "gdxts/dist/lib/Vector2";
import Walkable from "walkable";
import { ChangeMapSystem } from "./ChangeMapSystem";
import { Constants } from "./Constant";
import { GameState } from "./dto/gameState";
import { EnemyProcessingSystem } from "./enemy/EnemyProcessingSystem";
import { EnemyRenderSystem } from "./enemy/EnemyRenderSystem";
import { EnemySpawningSystem } from "./enemy/EnemySpawningSystem";
import { MapRenderingSystem } from "./MapRenderingSystem";
import MovementSystem from "./MovementSystem";
import { ObstaclesSystem } from "./ObstaclesSystem";
import PathFindingSystem from "./PathFindingSystem";
import { JoyStick, PlayerMovementSystem } from "./player/PlayerMovementSystem";
import { PlayerRenderSystem } from "./player/PlayerRenderSystem";
import { BulletProcessingSystem } from "./player/skill/BulletProcessingSystem";
import { BulletRenderSystem } from "./player/skill/BulletRenderSystem";
import { BulletSpawningSystem } from "./player/skill/BulletSpawningSystem";
import PursuitSystem from "./PursuitSystem";
import { GameConfig } from "./ulis/currentMap";
import { LayerMapRender } from "./ulis/layerMapRender";
import { mapData } from "./ulis/mapData";
import { Port } from "./ulis/port";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(
    canvas,
    Constants.MAP_WIDTH,
    Constants.MAP_HEIGHT + 20
  );
  const gl = viewport.getContext();

  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  const camera = viewport.getCamera();
  const world = new World();

  const tileSets = await Texture.load(gl, "./tiles_dungeon_v1.1.png");
  const tileSetsRegions = TextureRegion.splitTexture(tileSets, 20, 24);

  gl.clearColor(0, 0, 0, 1);

  const inputHandler = new ViewportInputHandler(viewport);

  const gameConfig: GameConfig = {
    mapNumber: 1,
    changePreMap: false,
    changeCurrentMap: true,
    changeNextMap: false,
  };

  const port: Port = {
    preMap: null,
    spawn: null,
    nextMap: null,
  };
  const mapData: mapData = {
    map1: await fetch(`./01.tmj`).then((res) => res.json()),
    map2: await fetch(`./02.tmj`).then((res) => res.json()),
    map3: await fetch(`./03.tmj`).then((res) => res.json()),
    map4: await fetch(`./04.tmj`).then((res) => res.json()),
  };

  port.spawn = mapData.map1.layers
    .find((d: any) => d.name === "data")
    .objects.find((s: any) => s.name === "spawn");

  port.preMap = mapData.map1.layers
    .find((d: any) => d.name === "data")
    .objects.find((s: any) => s.name === "previousMap");

  port.nextMap = mapData.map1.layers
    .find((d: any) => d.name === "data")
    .objects.find((s: any) => s.name === "nextMap");

  const joyStick: JoyStick = {
    origin: new Vector2(),
    direction: new Vector2(),
    thumbPos: new Vector2(),

    touched: false,
    move: false,
    dragging: false,
  };

  const layersMapRender: LayerMapRender = {
    walls: mapData.map1.layers.find((w: any) => w.name === "walls").data,
    layer1: mapData.map1.layers.find((w: any) => w.name === "layer1").data,
    layer2: mapData.map1.layers.find((w: any) => w.name === "layer2").data,
    obstacle: mapData.map1.layers.find((w: any) => w.name === "obstacles").data,
  };
  const rects: { x: number; y: number; width: number; height: number }[] = [];
  const obstacles: { x: number; y: number; width: number; height: number }[] =
    [];

  for (let i = 0; i < Constants.MAP_GRID_COLS; i++) {
    for (let j = 0; j < Constants.MAP_GRID_ROWS; j++) {
      obstacles.push({
        x: Constants.CELL_WIDTH * j,
        y:
          Constants.CELL_HEIGHT * Constants.MAP_GRID_ROWS -
          Constants.CELL_HEIGHT * i,
        width: Constants.CELL_WIDTH,
        height: Constants.CELL_HEIGHT,
      });
    }
  }
  const OFFSET_TILE_MAP = 10;

  const bumpWorld = Bump.newWorld(Constants.CELL_WIDTH);
  const walkable = new Walkable(Constants.MAP_WIDTH, Constants.MAP_HEIGHT);

  bumpWorld.add(
    "player",
    port.spawn.x - OFFSET_TILE_MAP / 2,
    Constants.MAP_HEIGHT - port.spawn.y + OFFSET_TILE_MAP,
    10,
    10
  );
  const gameState: GameState = {
    playerID: 0,
    enemyIDs: [],
    bulletIDs: [],
  };

  world.register("bumpWorld", bumpWorld);
  world.register("walkable", walkable);
  world.register("gameState", gameState);
  world.register("inputHandler", inputHandler);
  world.register("joyStick", joyStick);
  world.register("shapeRenderer", shapeRenderer);
  world.register("batch", batch);
  world.register("rects", rects);
  world.register("obstacles", obstacles);
  world.register("tileSetsRegions", tileSetsRegions);
  world.register("gameConfig", gameConfig);
  world.register("port", port);
  world.register("layersMapRender", layersMapRender);
  world.register("mapData", mapData);

  world.addSystem(new ObstaclesSystem(), true);
  world.addSystem(new PlayerMovementSystem(), true);
  world.addSystem(new ChangeMapSystem(), true);
  world.addSystem(new PathFindingSystem(), true);
  world.addSystem(new EnemySpawningSystem(), true);
  world.addSystem(new EnemyProcessingSystem(), true);
  world.addSystem(new PursuitSystem(), true);
  world.addSystem(new MovementSystem(), true);
  // world.addSystem(new BulletSpawningSystem(), true);
  // world.addSystem(new BulletProcessingSystem(), true);

  world.addSystem(new MapRenderingSystem(), false);
  world.addSystem(new PlayerRenderSystem(), false);
  world.addSystem(new EnemyRenderSystem(), false);
  world.addSystem(new BulletRenderSystem(), false);

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.combined);
    shapeRenderer.setProjection(camera.combined);
    world.setDelta(delta);

    world.processActiveSystem();
    world.processPassiveSystem();
  });
};
init();
