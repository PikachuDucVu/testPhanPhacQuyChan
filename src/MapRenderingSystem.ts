import { Inject, System } from "flat-ecs";
import { PolygonBatch, ShapeRenderer, TextureRegion } from "gdxts";
import { Constants } from "./Constant";
import { LayerMapRender } from "./ulis/layerMapRender";

export class MapRenderingSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("batch") batch: PolygonBatch;
  @Inject("tileSetsRegions") tileSetsRegions: TextureRegion[];
  @Inject("layersMapRender") layersMapRender: LayerMapRender;
  @Inject("rects") rects: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];

  initialized(): void {
    for (let i = 0; i < Constants.MAP_GRID_COLS; i++) {
      for (let j = 0; j < Constants.MAP_GRID_ROWS; j++) {
        this.rects.push({
          x: Constants.CELL_WIDTH * j,
          y:
            Constants.CELL_HEIGHT * Constants.MAP_GRID_ROWS -
            Constants.CELL_HEIGHT * i,
          width: Constants.CELL_WIDTH,
          height: Constants.CELL_HEIGHT,
        });
      }
    }
  }

  process(): void {
    this.batch.begin();

    this.layersMapRender.walls.forEach((regionId: number, index: number) => {
      const region = this.tileSetsRegions[regionId - 1];
      const rect = this.rects[index];
      region.draw(this.batch, rect.x, rect.y, rect.width, rect.height);
    });

    this.layersMapRender.layer1.forEach((regionId: number, index: number) => {
      if (regionId) {
        const region = this.tileSetsRegions[regionId - 1];
        const rect = this.rects[index];
        region.draw(this.batch, rect.x, rect.y, rect.width, rect.height);
      }
    });

    this.layersMapRender.layer2.forEach((regionId: number, index: number) => {
      if (regionId) {
        const region = this.tileSetsRegions[regionId - 1];
        const rect = this.rects[index];
        region.draw(this.batch, rect.x, rect.y, rect.width, rect.height);
      }
    });
    this.layersMapRender.obstacle.forEach((regionId: number, index: number) => {
      if (regionId) {
        const region = this.tileSetsRegions[regionId - 1];
        const rect = this.rects[index];
        region.draw(this.batch, rect.x, rect.y, rect.width, rect.height);
      }
    });

    this.batch.end();
  }
}
