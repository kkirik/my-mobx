import React from "react";
import { render } from "react-dom";

let CurrentObserver;
class Cell {
  constructor(val) {
    this.value = val;
    this.reactions = new Set();
  }
  get() {
    if (CurrentObserver) {
      this.reactions.add(CurrentObserver);
    }
    return this.value;
  }
  set(val) {
    this.value = val;
    for (const reaction of this.reactions) {
      reaction.run();
    }
  }
  unsubscribe(reaction) {
    this.reactions.delete(reaction);
  }
}

class ComputedCell extends Cell {
  constructor(computedFn, reactionFn) {
    super();
    this.computedFn = computedFn;
    this.reactionFn = reactionFn;
    this.value = this.track();
  }

  track() {
    const prevObserver = CurrentObserver;
    CurrentObserver = this;
    const newValue = this.computedFn();
    CurrentObserver = prevObserver;
    return newValue;
  }

  run() {
    const newValue = this.track();
    if (newValue !== this.value) {
      this.value = newValue;
      CurrentObserver = null;
      this.reactionFn();
    }
  }
}

function observable(target, key) {
  return {
    get() {
      if (!this.__observables) this.__observables = {};
      let observable = this.__observables[key];
      if (!observable) observable = this.__observables[key] = new Cell();
      return observable.get();
    },
    set(val) {
      if (!this.__observables) this.__observables = {};
      let observable = this.__observables[key];
      if (!observable) observable = this.__observables[key] = new Cell();
      observable.set(val);
    }
  };
}

function observer(Component) {
  const oldRender = Component.prototype.render;
  Component.prototype.render = function() {
    if (!this._reaction)
      this._reaction = new ComputedCell(oldRender.bind(this), () =>
        this.forceUpdate()
      );
    return this._reaction.get();
  };
}

class Timer {
  @observable count;
  constructor(text) {
    this.count = 0;
  }
}

const AppState = new Timer();

@observer
class App extends React.Component {
  onClick = () => {
    this.props.timer.count++;
  };
  render() {
    console.log("render");
    const { timer } = this.props;
    return (
      <div>
        <div>{timer.count}</div>
        <button onClick={this.onClick}>click</button>
      </div>
    );
  }
}

render(<App timer={AppState} />, document.getElementById("root"));
