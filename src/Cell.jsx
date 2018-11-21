export let CurrentObserver = null;

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

  unsibscribe(reaction) {
    this.reactions.delete(reaction);
  }
}

export default Cell;
