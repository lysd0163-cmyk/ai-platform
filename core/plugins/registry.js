class PluginRegistry {
  constructor() {
    this.plugins = new Map();
  }

  register(name, plugin) {
    if (!name) {
      throw new Error('Plugin registration requires a name');
    }

    this.plugins.set(name, plugin);
    return this;
  }

  get(name) {
    return this.plugins.get(name) || null;
  }

  list() {
    return Array.from(this.plugins.entries()).map(([name, plugin]) => ({ name, plugin }));
  }

  has(name) {
    return this.plugins.has(name);
  }

  remove(name) {
    return this.plugins.delete(name);
  }
}

module.exports = {
  PluginRegistry,
};
