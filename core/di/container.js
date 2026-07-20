class Container {
  constructor() {
    this.registry = new Map();
  }

  register(name, value) {
    if (!name) {
      throw new Error('Container registration requires a name');
    }

    this.registry.set(name, value);
    return this;
  }

  has(name) {
    return this.registry.has(name);
  }

  resolve(name) {
    if (!this.registry.has(name)) {
      throw new Error(`Container entry not found: ${name}`);
    }

    const entry = this.registry.get(name);
    return typeof entry === 'function' ? entry(this) : entry;
  }

  remove(name) {
    return this.registry.delete(name);
  }

  clear() {
    this.registry.clear();
  }
}

module.exports = {
  Container,
};
