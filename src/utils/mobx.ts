let CurrentObserver = null;

class Cell {
  reactions: Set<ComputedCell> = new Set();

  constructor(public value?) {}

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

  unsibscribe(reaction) {
    this.reactions.delete(reaction);
  }
}

class ComputedCell extends Cell {
  constructor(private computedFn, private reactionFn) {
    super(null);
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

export function observable(_target, key): any {
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

export function observer(Component) {
  const oldRender = Component.prototype.render;

  Component.prototype.render = function() {
    if (!this._reaction)
      this._reaction = new ComputedCell(oldRender.bind(this), () =>
        this.forceUpdate()
      );
    return this._reaction.get();
  };
}
