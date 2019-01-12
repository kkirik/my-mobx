import { observable, action } from "src/utils/mobx";

export class CounterStore {
  @observable counter: number;
  @observable observableVariable: number;

  constructor() {
    this.counter = 0;
    this.observableVariable = 0;

    this.incrementCounter = this.incrementCounter.bind(this);
  }

  // @action.bound
  incrementCounter = () =>
    action(() => {
      this.counter += 1;
      this.observableVariable += 2;
    });
}
