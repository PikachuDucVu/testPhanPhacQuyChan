export class Constants {
  public static readonly MAP_WIDTH = 320;
  public static readonly MAP_HEIGHT = 320;
  public static readonly MAP_GRID_COLS = 20;
  public static readonly MAP_GRID_ROWS = 20;
  public static readonly CELL_WIDTH =
    Constants.MAP_WIDTH / Constants.MAP_GRID_COLS;
  public static readonly CELL_HEIGHT =
    Constants.MAP_HEIGHT / Constants.MAP_GRID_ROWS;
  public static readonly MAX_COUNT_MAP = 3;
}
