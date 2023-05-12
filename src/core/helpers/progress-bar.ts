const FRACTIONS_COUNT = 8;
const FULL_STEP = String.fromCharCode(9608);
const FRACTIONS = [
  ' ',
  String.fromCharCode(9615),
  String.fromCharCode(9614),
  String.fromCharCode(9613),
  String.fromCharCode(9612),
  String.fromCharCode(9611),
  String.fromCharCode(9610),
  String.fromCharCode(9609),
  String.fromCharCode(9608)
];
const DEFAULT_WIDTH = 10;
const MAX_WIDTH = 50;

export class ProgressBar {
  private readonly width: number = DEFAULT_WIDTH;
  private readonly max: number;
  private readonly step: number;
  private readonly littleStep: number;
  private emptyProgress: string[];
  constructor (max: number, width?: number) {
    this.max = max;
    if (width) {
      this.width = width > MAX_WIDTH ? MAX_WIDTH : width;
    }
    this.step = this.max / this.width;
    this.littleStep = this.step / FRACTIONS_COUNT;
    this.emptyProgress = new Array(this.width).fill(' ');
  }

  public getProgress (value: number) {
    const progress = value > this.max ? this.max : value;
    const stepsCount = Math.floor(progress / this.step);
    return Array.from(this.emptyProgress, ((element, index) => {
      if (index < stepsCount) {
        return FULL_STEP;
      }
      if (index === stepsCount) {
        return FRACTIONS[Math.round((progress - stepsCount * this.step) / this.littleStep)];
      }
      return element;
    })).join('');
  }
}
