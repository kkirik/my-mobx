import React from "react";
// import { observer } from "mobx-react";

import { observer } from "./utils/mobx";
import { CounterStore } from "./stores/CounterStore";

interface IProps {
  counterStore: CounterStore;
}

@observer
class Counter extends React.Component<IProps> {
  render() {
    const {
      incrementCounter,
      counter,
      observableVariable
    } = this.props.counterStore;

    console.log("====================================");
    console.log("render", counter, observableVariable);
    console.log("====================================");

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
