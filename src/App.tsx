import React from "react";

import { observer, observable } from "./utils/mobx";

interface IProps {
  counterStore: CounterStore;
}

class CounterStore {
  @observable counter: number = 0;
  @observable observableVariable: number = 0;

  constructor() {
    this.counter = 0;
    this.observableVariable = 0;
  }

  incrementCounter = () => {
    this.counter += 1;
  };
}

@observer
class Counter extends React.Component<IProps> {
  render() {
    const { counter, incrementCounter } = this.props.counterStore;

    return (
      <div>
        <div>{counter}</div>
        <button onClick={incrementCounter}>+1</button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    const counterStore = new CounterStore();

    return (
      <div>
        {counterStore.observableVariable}
        <Counter counterStore={counterStore} />
      </div>
    );
  }
}

export default App;
