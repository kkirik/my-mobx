class Comment {
  @observable text;
  constructor(text) {
    this.text = text;
  }
}

function observable(target, key, descriptor) {
  descriptor.get = function() {
    if (!this.__observables) this.__observables = {};
    const observable = this.__observables[key];
    if (!observable) this.__observables[key] = new Observable();
    return observable.get();
  };
  descriptor.set = function(val) {
    if (!this.__observables) this.__observables = {};
    const observable = this.__observables[key];
    if (!observable) this.__observables[key] = new Observable();
    observable.set(val);
  };
  return descriptor;
}
