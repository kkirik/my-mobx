let CurrentObserver = null;
let TransactionCount = 0;
let PendingComponents = new Set();

class Cell {
  reactions: Set<ComputedCell> = new Set();
  dependencies: Set<ComputedCell> = new Set();

  constructor(public value?) {}

  get() {
    if (CurrentObserver) {
      this.reactions.add(CurrentObserver);
      CurrentObserver.dependencies.add(this);
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
  constructor(private computedFn, private reactionFn) {
    super(null);
    this.value = this.track();
  }

  track() {
    const prevObserver = CurrentObserver;
    CurrentObserver = this;

    const oldDependencies = this.dependencies;
    this.dependencies = new Set();
    const newValue = this.computedFn();

    // Отписка от старых зависимостей
    for (const dependency of oldDependencies) {
      if (!this.dependencies.has(dependency)) {
        dependency.unsubscribe(this);
      }
    }

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

/**
 * Observable
 * @param _target
 * @param key
 */

export function observable(_target: object, key: string): any {
  return {
    get() {
      if (!this.__observables) this.__observables = {};
      let observable = this.__observables[key];
      if (!observable) observable = this.__observables[key] = new Cell();
      return observable.get();
    },

    set(val: any) {
      if (!this.__observables) this.__observables = {};
      let observable = this.__observables[key];
      if (!observable) observable = this.__observables[key] = new Cell();
      observable.set(val);
    }
  };
}

/**
 * Observer
 * @param Component
 */

export function observer(Component) {
  const oldRender = Component.prototype.render;

  Component.prototype.render = function() {
    if (!this._reaction)
      this._reaction = new ComputedCell(oldRender.bind(this), () => {
        TransactionCount ? PendingComponents.add(this) : this.forceUpdate();
      });

    return this._reaction.get();
  };
}

/**
 * Action
 * @param fn
 */

export function action(fn: object | Function, name?: string, descriptor?: object | any) {
  let func;

  if (typeof fn !== 'function') {
    func = descriptor.value;
  } else {
    func = fn;
  }

  TransactionCount += 1;
  const result = func();
  TransactionCount -= 1;

  if (TransactionCount == 0) {
    for (const component of PendingComponents) {
      component.forceUpdate();
    }
  }

  return result;
}

action.bound = function(fn: object | Function, name?: string, descriptor?: object | any) {
  return action(descriptor.value.bind(fn), name, descriptor);
};
