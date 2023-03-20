import { IRect, World } from "bump-ts";
import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import Walkable from "walkable";
import { LayerMapRender } from "./ulis/layerMapRender";
import { mapData } from "./ulis/mapData";

export class ObstaclesSystem extends System {
  @Inject("bumpWorld") bumpWorld: World;
  @Inject("mapData") mapData: mapData;
  @Inject("obstacles") obstacles: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  @Inject("layersMapRender") layersMapRender: LayerMapRender;
  @Inject("walkable") walkable: Walkable;
  temp: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;

  initialized(): void {
    for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
      if (this.layersMapRender.obstacle[i]) {
        this.bumpWorld.add(
          `obstacle${i}`,
          this.obstacles[i].x,
          this.obstacles[i].y,
          this.obstacles[i].width,
          this.obstacles[i].height
        );

        this.walkable.addRect(
          this.obstacles[i].width,
          this.obstacles[i].height,
          this.obstacles[i].x,
          this.obstacles[i].y
        );
      }
    }
  }

  process(): void {
    // for (let i = 0; i < this.layersMapRender.obstacle.length; i++) {
    //   if (this.layersMapRender.obstacle[i]) {
    //     getRectObs.push(this.bumpWorld.getRect(`obstacle${i}`));
    //   }
    // }
  }
}
