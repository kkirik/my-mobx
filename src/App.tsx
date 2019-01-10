import React from 'react';

import { observer, observable, action, dec } from './utils/mobx';

interface IProps {
  counterStore: CounterStore;
}

class CounterStore {
  @observable counter: number;
  @observable observableVariable: number;

  constructor() {
    this.counter = 0;
    this.observableVariable = 0;

    this.incrementCounter = this.incrementCounter.bind(this);
  }

  @action.bound
  incrementCounter() {
    this.counter += 1;
    this.observableVariable += 2;
  }
}

@observer
class Counter extends React.Component<IProps> {
  render() {
    const { counter, incrementCounter, observableVariable } = this.props.counterStore;

    console.log('====================================');
    console.log('render', counter, observableVariable);
    console.log('====================================');

    return (
      <div>
        <div>{observableVariable}</div>
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
        <Counter counterStore={counterStore} />
      </div>
    );
  }
}

export default App;
