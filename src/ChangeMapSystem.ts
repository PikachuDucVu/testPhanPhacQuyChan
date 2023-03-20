import { World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Constants } from "./Constant";
import { GameConfig } from "./ulis/currentMap";
import { LayerMapRender } from "./ulis/layerMapRender";
import { mapData } from "./ulis/mapData";
import { Port } from "./ulis/port";

export class ChangeMapSystem extends System {
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("gameConfig") gameConfig: GameConfig;
  @Inject("port") port: Port;
  @Inject("layersMapRender") layersMapRender: LayerMapRender;
  @Inject("obstacles") obstacles: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  @Inject("mapData") mapData: mapData;

  reload = false;
  realNextMapPosY = 0;
  realPreMapPosY = 0;
  offsetTileMap = 10;

  initialized(): void {
    // if (this.port.nextMap) {
    //   this.realNextMapPosY =
    //     Constants.MAP_HEIGHT - this.port.nextMap.y + this.offsetTileMap;
    // }
    // if (this.port.preMap) {
    //   this.realPreMapPosY =
    //     Constants.MAP_HEIGHT - this.port.preMap.y + this.offsetTileMap;
    // }
  }

  process(): void {
    const playerRect = this.bumpWorld.getRect("player");

    if (
      this.gameConfig.mapNumber > 1 &&
      Math.abs(playerRect.x - (this.port.preMap.x - 5)) <=
        this.offsetTileMap / 1.5 &&
      Math.abs(
        playerRect.y -
          (Constants.MAP_HEIGHT - this.port.preMap.y + this.offsetTileMap + 10)
      ) <=
        this.offsetTileMap / 1.5
    ) {
      this.gameConfig.mapNumber--;

      for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
        if (this.layersMapRender.obstacle[i]) {
          this.bumpWorld.remove(`obstacle${i}`);
        }
      }
      if (this.gameConfig.mapNumber === 1) {
        //updatePort
        this.port.nextMap = this.mapData.map1.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "nextMap");

        //render
        this.layersMapRender.walls = this.mapData.map1.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map1.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map1.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map1.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.bumpWorld.move(
          "player",
          this.port.nextMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.nextMap.y + this.offsetTileMap + 20
        );
      }

      if (this.gameConfig.mapNumber === 2) {
        //updatePort
        this.port.preMap = this.mapData.map2.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "previousMap");

        this.port.nextMap = this.mapData.map2.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "nextMap");

        this.layersMapRender.walls = this.mapData.map2.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map2.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map2.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map2.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.bumpWorld.move(
          "player",
          this.port.nextMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.nextMap.y + this.offsetTileMap - 10
        );
      }

      if (this.gameConfig.mapNumber === 3) {
        //updatePort
        this.port.preMap = this.mapData.map3.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "previousMap");

        this.port.nextMap = this.mapData.map3.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "nextMap");

        this.layersMapRender.walls = this.mapData.map3.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map3.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map3.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map3.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.bumpWorld.move(
          "player",
          this.port.nextMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.nextMap.y + this.offsetTileMap + 20
        );
      }

      for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
        if (this.layersMapRender.obstacle[i]) {
          this.bumpWorld.add(
            `obstacle${i}`,
            this.obstacles[i].x,
            this.obstacles[i].y,
            this.obstacles[i].width,
            this.obstacles[i].height
          );
        }
      }
    }

    if (
      this.gameConfig.mapNumber < 4 &&
      Math.abs(playerRect.x - (this.port.nextMap.x - 5)) <=
        this.offsetTileMap / 1.5 &&
      Math.abs(
        playerRect.y -
          (Constants.MAP_HEIGHT - this.port.nextMap.y + this.offsetTileMap + 10)
      ) <=
        this.offsetTileMap / 1.5
    ) {
      this.gameConfig.mapNumber++;

      for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
        if (this.layersMapRender.obstacle[i]) {
          this.bumpWorld.remove(`obstacle${i}`);
        }
      }
      if (this.gameConfig.mapNumber === 2) {
        //updatePort
        this.port.spawn = this.mapData.map2.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "spawn");

        this.port.preMap = this.mapData.map2.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "previousMap");
        this.port.nextMap = this.mapData.map2.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "nextMap");

        this.layersMapRender.walls = this.mapData.map2.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map2.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map2.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map2.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.bumpWorld.move(
          "player",
          this.port.preMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.preMap.y + this.offsetTileMap - 10
        );
      }

      if (this.gameConfig.mapNumber === 3) {
        //updatePort

        this.layersMapRender.walls = this.mapData.map3.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map3.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map3.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map3.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.port.preMap = this.mapData.map3.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "previousMap");

        this.port.nextMap = this.mapData.map3.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "nextMap");

        this.bumpWorld.move(
          "player",
          this.port.preMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.preMap.y + this.offsetTileMap + 20
        );
      }

      if (this.gameConfig.mapNumber === 4) {
        //updatePort
        this.layersMapRender.walls = this.mapData.map4.layers.find(
          (w: any) => w.name === "walls"
        ).data;
        this.layersMapRender.layer1 = this.mapData.map4.layers.find(
          (w: any) => w.name === "layer1"
        ).data;
        this.layersMapRender.layer2 = this.mapData.map4.layers.find(
          (w: any) => w.name === "layer2"
        ).data;
        this.layersMapRender.obstacle = this.mapData.map4.layers.find(
          (w: any) => w.name === "obstacles"
        ).data;

        this.port.preMap = this.mapData.map4.layers
          .find((d: any) => d.name === "data")
          .objects.find((s: any) => s.name === "previousMap");

        this.bumpWorld.move(
          "player",
          this.port.preMap.x - this.offsetTileMap / 2,
          Constants.MAP_HEIGHT - this.port.preMap.y + this.offsetTileMap - 20
        );
      }

      for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
        if (this.layersMapRender.obstacle[i]) {
          this.bumpWorld.add(
            `obstacle${i}`,
            this.obstacles[i].x,
            this.obstacles[i].y,
            this.obstacles[i].width,
            this.obstacles[i].height
          );
        }
      }
    }
  }
}
