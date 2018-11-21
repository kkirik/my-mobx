import Cell, { CurrentObserver } from "./Cell";

export default class ComputedCell extends Cell {
  constructor(computedFn, reactionFn) {
    super(undefined);

    this.computedFn = computedFn;
    this.reactionFn = reactionFn;
  }

  run() {
    const prevObserver = CurrentObserver;
    const newValue = this.computedFn();

    CurrentObserver = this;

    if (newValue !== this.value) {
      this.value = newValue;
      CurrentObserver = null;
      this.reactionFn();
      this.reactions.forEach(r => r.run());
    }

    CurrentObserver = prevObserver;
  }
}
