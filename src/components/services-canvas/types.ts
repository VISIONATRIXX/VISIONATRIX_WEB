export interface CanvasRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  mx: number;
  my: number;
  isHovered: boolean;
}
